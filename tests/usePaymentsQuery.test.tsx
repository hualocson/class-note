// @vitest-environment jsdom
import React, { type PropsWithChildren } from "react";

import { getPaymentStats, getPayments } from "@/actions/payments";
import type { GetPaymentsSuccessResponseData } from "@/actions/types";
import { PaymentStatus } from "@/enums/payment-status";
import usePaymentsQuery from "@/hooks/usePaymentsQuery";
import { invalidatePaymentQueries } from "@/lib/payment-query-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/actions/payments", () => ({
  getPayments: vi.fn(),
  getPaymentStats: vi.fn(),
}));

const payment: GetPaymentsSuccessResponseData["rows"][number] = {
  id: "20000000-0000-4000-8000-000000000001",
  date: new Date("2026-11-01T00:00:00Z"),
  classId: "10000000-0000-4000-8000-000000000001",
  amount: 1000,
  status: PaymentStatus.PENDING,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  class: { name: "Class A", code: null, color: "#3b82f6" },
};
const summary = (rowCount = 23) => ({
  success: true as const,
  data: {
    rowCount,
    totalAmount: rowCount * 1000,
    paidAmount: 0,
    pendingAmount: rowCount * 1000,
    cancelledAmount: 0,
  },
});

let client: QueryClient;
function mount() {
  return renderHook(() => usePaymentsQuery(), {
    wrapper: ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
  });
  vi.mocked(getPayments).mockResolvedValue({
    success: true,
    data: { rows: [payment] },
  });
  vi.mocked(getPaymentStats).mockResolvedValue(summary());
});
afterEach(() => {
  cleanup();
  client.clear();
});

describe("payments query state", () => {
  it("loads one all-time rows query and one summary on mount", async () => {
    const { result } = mount();
    await waitFor(() =>
      expect(
        result.current.rowsQuery.isSuccess &&
          result.current.summaryQuery.isSuccess
      ).toBe(true)
    );
    expect(getPayments).toHaveBeenCalledTimes(1);
    expect(getPayments).toHaveBeenCalledWith({
      filters: {},
      pagination: { pageIndex: 0, pageSize: 10 },
    });
    expect(getPaymentStats).toHaveBeenCalledExactlyOnceWith({});
  });

  it("reuses the exact summary on page-only changes", async () => {
    const { result } = mount();
    await waitFor(() =>
      expect(result.current.summaryQuery.isSuccess).toBe(true)
    );
    act(() => result.current.setPagination({ pageIndex: 1, pageSize: 10 }));
    await waitFor(() => expect(getPayments).toHaveBeenCalledTimes(2));
    expect(getPaymentStats).toHaveBeenCalledTimes(1);
    expect(result.current.rowCount).toBe(23);
  });

  it("changes filters and resets a later page in one transition", async () => {
    const { result } = mount();
    await waitFor(() =>
      expect(result.current.summaryQuery.isSuccess).toBe(true)
    );
    act(() => result.current.setPagination({ pageIndex: 2, pageSize: 10 }));
    await waitFor(() => expect(result.current.pagination.pageIndex).toBe(2));
    vi.mocked(getPayments).mockClear();
    act(() =>
      result.current.setColumnFilters([
        { id: "status", value: [PaymentStatus.PAID] },
      ])
    );
    await waitFor(() => expect(getPayments).toHaveBeenCalledTimes(1));
    expect(getPayments).toHaveBeenCalledWith({
      filters: { status: [PaymentStatus.PAID] },
      pagination: { pageIndex: 0, pageSize: 10 },
    });
    expect(result.current.pagination.pageIndex).toBe(0);
    expect(getPaymentStats).toHaveBeenLastCalledWith({
      status: [PaymentStatus.PAID],
    });
  });

  it("does not expose old-filter rows while new-filter rows are pending", async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.rowsQuery.isSuccess).toBe(true));
    const pending =
      Promise.withResolvers<Awaited<ReturnType<typeof getPayments>>>();
    vi.mocked(getPayments).mockReturnValue(pending.promise);
    act(() =>
      result.current.setColumnFilters([
        { id: "status", value: [PaymentStatus.PAID] },
      ])
    );
    expect(result.current.rowsQuery.data).toBeUndefined();
    expect(result.current.rowsQuery.isPending).toBe(true);
    await act(async () =>
      pending.resolve({ success: true, data: { rows: [] } })
    );
  });

  it("recovers the last page after deletion only after the summary refreshes", async () => {
    const { result } = mount();
    await waitFor(() =>
      expect(result.current.summaryQuery.isSuccess).toBe(true)
    );
    act(() => result.current.setPagination({ pageIndex: 2, pageSize: 10 }));
    await waitFor(() => expect(result.current.rowsQuery.isSuccess).toBe(true));
    const pending =
      Promise.withResolvers<Awaited<ReturnType<typeof getPaymentStats>>>();
    vi.mocked(getPaymentStats).mockReturnValue(pending.promise);
    vi.mocked(getPayments).mockResolvedValue({
      success: true,
      data: { rows: [] },
    });
    let refresh: Promise<void>;
    act(() => {
      refresh = invalidatePaymentQueries(client);
    });
    await waitFor(() =>
      expect(result.current.summaryQuery.isFetching).toBe(true)
    );
    expect(result.current.pagination.pageIndex).toBe(2);
    await act(async () => {
      pending.resolve(summary(20));
      await refresh;
    });
    await waitFor(() => expect(result.current.pagination.pageIndex).toBe(1));
    expect(result.current.rowCount).toBe(20);
    expect(getPayments).toHaveBeenLastCalledWith({
      filters: {},
      pagination: { pageIndex: 1, pageSize: 10 },
    });
  });

  it("surfaces action failures as query errors", async () => {
    vi.mocked(getPayments).mockResolvedValue({
      success: false,
      error: "Read failed",
    });
    const { result } = mount();
    await waitFor(() => expect(result.current.rowsQuery.isError).toBe(true));
    expect(result.current.rowsQuery.data).toBeUndefined();
    expect(result.current.rowsQuery.error?.message).toBe("Read failed");
  });

  it("marks inactive pages stale without immediately refetching them", async () => {
    const inactiveRows = vi.fn().mockResolvedValue({ rows: [payment] });
    const inactiveStats = vi.fn().mockResolvedValue(summary().data);
    const rowsKey = [
      "payments-table",
      { status: [PaymentStatus.PAID] },
      { pageIndex: 0, pageSize: 10 },
    ];
    const statsKey = ["payment-stats", { status: [PaymentStatus.PAID] }];
    await client.fetchQuery({ queryKey: rowsKey, queryFn: inactiveRows });
    await client.fetchQuery({ queryKey: statsKey, queryFn: inactiveStats });
    const { result } = mount();
    await waitFor(() =>
      expect(
        result.current.rowsQuery.isSuccess &&
          result.current.summaryQuery.isSuccess
      ).toBe(true)
    );
    await act(() => invalidatePaymentQueries(client));
    expect(inactiveRows).toHaveBeenCalledTimes(1);
    expect(inactiveStats).toHaveBeenCalledTimes(1);
    expect(client.getQueryState(rowsKey)?.isInvalidated).toBe(true);
    expect(client.getQueryState(statsKey)?.isInvalidated).toBe(true);
    expect(getPayments).toHaveBeenCalledTimes(2);
    expect(getPaymentStats).toHaveBeenCalledTimes(2);
    await client.fetchQuery({ queryKey: rowsKey, queryFn: inactiveRows });
    expect(inactiveRows).toHaveBeenCalledTimes(2);
  });
});
