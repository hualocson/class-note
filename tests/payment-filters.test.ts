import { PaymentStatus } from "@/enums/payment-status";
import {
  filtersFromColumns,
  normalizePaymentFilters,
  parsePaymentPagination,
} from "@/lib/payment-filters";
import { describe, expect, it } from "vitest";

const classA = "10000000-0000-4000-8000-000000000001";
const classB = "10000000-0000-4000-8000-000000000002";

describe("payment filter inputs", () => {
  it("uses one all-time identity for absent and cleared filters", () => {
    expect(normalizePaymentFilters()).toEqual({});
    expect(normalizePaymentFilters({ status: [], classIds: [] })).toEqual({});
    expect(filtersFromColumns([])).toEqual({});
  });

  it("deduplicates and orders equivalent selections without changing the input", () => {
    const filters = {
      status: [
        PaymentStatus.PENDING,
        PaymentStatus.PAID,
        PaymentStatus.PENDING,
      ],
      classIds: [classB, classA, classB],
    };
    expect(normalizePaymentFilters(filters)).toEqual({
      status: [PaymentStatus.PAID, PaymentStatus.PENDING],
      classIds: [classA, classB],
    });
    expect(filters.classIds).toEqual([classB, classA, classB]);
  });

  it("maps the table's column IDs to the same action input once", () => {
    expect(
      filtersFromColumns([
        { id: "status", value: [PaymentStatus.PENDING] },
        { id: "class", value: [classA] },
        { id: "date", value: [1000, 1999] },
      ])
    ).toEqual({
      status: [PaymentStatus.PENDING],
      classIds: [classA],
      dateRange: "1000-1999",
    });
  });

  it.each([
    "bad",
    "1000",
    "1000-",
    "2000-1000",
    "NaN-1000",
    "1-Infinity",
    "1-8640000000000001",
    "1-2-3",
  ])("rejects malformed or invalid range %s", (dateRange) => {
    expect(() => normalizePaymentFilters({ dateRange })).toThrow();
  });

  it("accepts a single millisecond and the Unix epoch inclusively", () => {
    expect(normalizePaymentFilters({ dateRange: "0-0" })).toEqual({
      dateRange: "0-0",
    });
  });

  it("validates statuses and class IDs rather than dropping invalid constraints", () => {
    expect(() => normalizePaymentFilters({ status: ["unknown"] })).toThrow();
    expect(() => normalizePaymentFilters({ classIds: ["invalid"] })).toThrow();
  });

  it("defaults pagination and accepts supported sizes", () => {
    expect(parsePaymentPagination()).toEqual({ pageIndex: 0, pageSize: 10 });
    for (const pageSize of [10, 20, 30, 40, 50]) {
      expect(parsePaymentPagination({ pageIndex: 2, pageSize })).toEqual({
        pageIndex: 2,
        pageSize,
      });
    }
  });

  it.each([
    { pageIndex: -1 },
    { pageIndex: 0.5 },
    { pageIndex: Infinity },
    { pageIndex: Number.MAX_SAFE_INTEGER },
    { pageSize: 0 },
    { pageSize: 1000 },
  ])("rejects invalid pagination %j", (pagination) => {
    expect(() => parsePaymentPagination(pagination)).toThrow();
  });
});
