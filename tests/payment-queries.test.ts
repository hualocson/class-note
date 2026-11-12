import { db } from "@/db";
import {
  buildPaymentRowsQuery,
  buildPaymentSummaryQuery,
} from "@/db/queries/payments";
import { PaymentStatus } from "@/enums/payment-status";
import { normalizePaymentFilters } from "@/lib/payment-filters";
import { classesTable } from "@/schemas/classes";
import { paymentsTable } from "@/schemas/payments";
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Substitute only the connection: the real Drizzle builders execute real PostgreSQL.
vi.mock("@/db", async () => {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  return { db: drizzle(new PGlite(), { casing: "snake_case" }) };
});

const classA = "10000000-0000-4000-8000-000000000001";
const classB = "10000000-0000-4000-8000-000000000002";
const deletedClass = "10000000-0000-4000-8000-000000000003";
const start = new Date("2026-11-01T00:00:00.000Z");
const end = new Date("2026-11-02T00:00:00.000Z");
const paymentId = (index: number) =>
  `20000000-0000-4000-8000-${String(index).padStart(12, "0")}`;

beforeAll(async () => {
  const schema = `
    CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'cancelled');
    CREATE TABLE classes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, code text,
      color text DEFAULT '#3b82f6', price bigint NOT NULL, sort_order integer DEFAULT 0,
      is_deleted boolean NOT NULL DEFAULT false, deleted_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE payments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), date timestamptz NOT NULL,
      class_id uuid NOT NULL REFERENCES classes(id), amount bigint NOT NULL,
      status payment_status NOT NULL DEFAULT 'paid', notes text,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  for (const statement of schema
    .split(";")
    .filter((statement) => statement.trim())) {
    await db.execute(sql.raw(statement));
  }
  await db.insert(classesTable).values([
    { id: classA, name: "Class A", price: 1000 },
    { id: classB, name: "Class B", price: 1000 },
    {
      id: deletedClass,
      name: "Deleted",
      price: 1000,
      isDeleted: true,
      deletedAt: start,
    },
  ]);
  await db.insert(paymentsTable).values([
    ...Array.from({ length: 23 }, (_, i) => ({
      id: paymentId(i + 1),
      date: i < 12 ? start : end,
      classId: i < 12 ? classA : classB,
      amount: (i + 1) * 1000,
      status: [
        PaymentStatus.PENDING,
        PaymentStatus.CANCELLED,
        PaymentStatus.PAID,
      ][i % 3],
      notes: `Payment ${i + 1}`,
    })),
    {
      id: paymentId(24),
      date: end,
      classId: deletedClass,
      amount: 999_000,
      status: PaymentStatus.PAID,
    },
  ]);
});

afterAll(async () => {
  // The connection is an isolated in-memory database, never DATABASE_URL.
  const client = db.$client as unknown as { close: () => Promise<void> };
  await client.close();
});

describe("payments rows and summary", () => {
  it("keeps an exact total independently of empty/out-of-range pages", async () => {
    const pages = await Promise.all(
      [0, 1, 2, 3].map((pageIndex) =>
        buildPaymentRowsQuery({ pageIndex, pageSize: 10 }, {})
      )
    );
    expect(pages.map((page) => page.length)).toEqual([10, 10, 3, 0]);
    const [summary] = await buildPaymentSummaryQuery({});
    expect(summary).toEqual({
      rowCount: 23,
      totalAmount: 276_000,
      paidAmount: 84_000,
      pendingAmount: 92_000,
      cancelledAmount: 100_000,
    });
    const ids = pages.flat().map((payment) => payment.id);
    expect(ids).toEqual(
      Array.from({ length: 23 }, (_, i) => paymentId(23 - i))
    );
    expect(new Set(ids).size).toBe(23);
    expect(pages[0][0]).toMatchObject({
      notes: "Payment 23",
      class: { name: "Class B", color: "#3b82f6" },
    });
    expect(pages[0][0]).not.toHaveProperty("rowCount");
  });

  it.each([
    [{ status: [PaymentStatus.PENDING] }, 8, 92_000],
    [{ status: [PaymentStatus.PAID] }, 7, 84_000],
    [{ status: [PaymentStatus.CANCELLED] }, 8, 100_000],
    [{ classIds: [classA] }, 12, 78_000],
    [{ classIds: [classA, classB] }, 23, 276_000],
    [{ classIds: [deletedClass] }, 0, 0],
    [{ dateRange: `${start.getTime()}-${start.getTime()}` }, 12, 78_000],
    [{ dateRange: `${start.getTime() + 1}-${end.getTime() - 1}` }, 0, 0],
    [
      {
        status: [PaymentStatus.PAID],
        classIds: [classB],
        dateRange: `${start.getTime()}-${end.getTime()}`,
      },
      3,
      54_000,
    ],
  ] as const)(
    "uses identical filters for rows and totals: %j",
    async (filters, count, amount) => {
      const mutableFilters = normalizePaymentFilters(filters);
      const rows = await buildPaymentRowsQuery(
        { pageIndex: 0, pageSize: 50 },
        mutableFilters
      );
      const [summary] = await buildPaymentSummaryQuery(mutableFilters);
      expect(rows).toHaveLength(count);
      expect(summary.rowCount).toBe(count);
      expect(summary.totalAmount).toBe(amount);
      expect(rows.reduce((total, row) => total + row.amount, 0)).toBe(amount);
    }
  );

  it("parameterizes filters and removes the page's full-set window", () => {
    const filters = {
      status: [PaymentStatus.PENDING],
      classIds: [classA],
      dateRange: `${start.getTime()}-${end.getTime()}`,
    };
    const rows = buildPaymentRowsQuery(
      { pageIndex: 2, pageSize: 10 },
      filters
    ).toSQL();
    const summary = buildPaymentSummaryQuery(filters).toSQL();
    expect(rows.sql).not.toMatch(/\bover\s*\(/i);
    expect(rows.sql).toContain('"payments"."date" desc, "payments"."id" desc');
    expect(rows.sql).not.toContain(classA);
    expect(rows.params).toContain(classA);
    expect(summary.sql).toMatch(/count\(\*\)/i);
    expect(rows.sql.split(" where ")[1].split(" order by ")[0]).toBe(
      summary.sql.split(" where ")[1]
    );
  });

  it("keeps exact numbered pages with 100,000 additional mixed payments", async () => {
    await db.execute(sql`BEGIN`);
    try {
      await db.execute(sql`
        INSERT INTO payments (id, date, class_id, amount, status)
        SELECT
          ('30000000-0000-4000-8000-' || lpad(i::text, 12, '0'))::uuid,
          '2026-11-10T00:00:00Z'::timestamptz + (i % 100) * interval '1 second',
          CASE WHEN i % 5 = 0 THEN ${deletedClass}::uuid
            WHEN i % 2 = 0 THEN ${classA}::uuid ELSE ${classB}::uuid END,
          i * 1000::bigint,
          (CASE WHEN i % 3 = 0 THEN 'paid'
            WHEN i % 3 = 1 THEN 'pending' ELSE 'cancelled' END)::payment_status
        FROM generate_series(1, 100000) AS i
      `);
      const [summary] = await buildPaymentSummaryQuery({});
      expect(summary.rowCount).toBe(80_023);
      const first = await buildPaymentRowsQuery(
        { pageIndex: 0, pageSize: 50 },
        {}
      );
      expect(first).toHaveLength(50);
      expect(first.every((row) => row.classId !== deletedClass)).toBe(true);
      const last = await buildPaymentRowsQuery(
        { pageIndex: 8002, pageSize: 10 },
        {}
      );
      expect(last.map((row) => row.id)).toEqual([
        paymentId(3),
        paymentId(2),
        paymentId(1),
      ]);
      const empty = await buildPaymentRowsQuery(
        { pageIndex: 8003, pageSize: 10 },
        {}
      );
      expect(empty).toEqual([]);
      expect(summary.rowCount).toBe(80_023);
    } finally {
      await db.execute(sql`ROLLBACK`);
    }
  }, 15_000);
});
