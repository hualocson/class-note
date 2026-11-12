import { getPaymentStats, getPayments } from "@/actions/payments";
import { PaymentStatus } from "@/enums/payment-status";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  auth: vi.fn(),
  rows: vi.fn(),
  summary: vi.fn(),
}));
vi.mock("@/configs/auth.config", () => ({ auth: boundary.auth }));
vi.mock("@/db", () => ({ db: {} }));
vi.mock("@/db/queries/payments", () => ({
  buildPaymentRowsQuery: boundary.rows,
  buildPaymentSummaryQuery: boundary.summary,
}));

beforeEach(() => {
  vi.resetAllMocks();
  boundary.auth.mockResolvedValue({ user: { name: "Reader" } });
  boundary.rows.mockResolvedValue([]);
  boundary.summary.mockResolvedValue([
    {
      rowCount: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      cancelledAmount: 0,
    },
  ]);
});
afterEach(() => vi.restoreAllMocks());

describe("payment read action boundaries", () => {
  it("rejects unauthenticated reads before constructing either query", async () => {
    boundary.auth.mockResolvedValue(null);
    expect(await getPayments()).toEqual({
      success: false,
      error: "Unauthorized",
    });
    expect(await getPaymentStats()).toEqual({
      success: false,
      error: "Unauthorized",
    });
    expect(boundary.rows).not.toHaveBeenCalled();
    expect(boundary.summary).not.toHaveBeenCalled();
  });

  it("validates filters and pagination before querying", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      (await getPayments({ pagination: { pageSize: 1000 } })).success
    ).toBe(false);
    expect(
      (await getPayments({ filters: { classIds: ["invalid"] } })).success
    ).toBe(false);
    expect((await getPaymentStats({ dateRange: "2-1" })).success).toBe(false);
    expect(boundary.rows).not.toHaveBeenCalled();
    expect(boundary.summary).not.toHaveBeenCalled();
  });

  it("passes the same normalized filters to independent rows and summary reads", async () => {
    const filters = {
      status: [
        PaymentStatus.PENDING,
        PaymentStatus.PAID,
        PaymentStatus.PENDING,
      ],
    };
    expect(await getPayments({ filters })).toEqual({
      success: true,
      data: { rows: [] },
    });
    expect((await getPaymentStats(filters)).success).toBe(true);
    const normalized = { status: [PaymentStatus.PAID, PaymentStatus.PENDING] };
    expect(boundary.rows).toHaveBeenCalledWith(
      { pageIndex: 0, pageSize: 10 },
      normalized
    );
    expect(boundary.summary).toHaveBeenCalledWith(normalized);
  });
});
