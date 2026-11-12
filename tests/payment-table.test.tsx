// @vitest-environment jsdom
import React from "react";

import {
  batchUpdatePaymentsStatus,
  deletePayments,
  getPaymentStats,
  getPayments,
} from "@/actions/payments";
import PaymentTable from "@/app/(protected)/payments/components/payment-table-view/PaymentTable";
import { getQueryClient } from "@/app/getQueryClient";
import { PaymentStatus } from "@/enums/payment-status";
import usePaymentsQuery from "@/hooks/usePaymentsQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

// No real actions, authentication, network, or database are used by this UI test.
vi.mock("@/actions/payments", () => ({
  getPayments: vi.fn(),
  getPaymentStats: vi.fn(),
  deletePayments: vi.fn(),
  batchUpdatePaymentsStatus: vi.fn(),
}));

const client = getQueryClient();
const classId = "10000000-0000-4000-8000-000000000001";
const paymentId = "20000000-0000-4000-8000-000000000001";
const now = new Date("2026-11-01T00:00:00Z");

function TableHarness() {
  const query = usePaymentsQuery();
  return (
    <PaymentTable
      query={query}
      classes={[]}
      canManagePayments={false}
      onAddPayment={() => {}}
      onDeletePayment={() => {}}
      onEditPayment={() => {}}
    />
  );
}

beforeEach(() => {
  // jsdom does not implement layout scrolling used by Radix's keyboard focus.
  Element.prototype.scrollIntoView = () => {};
  vi.resetAllMocks();
  client.clear();
  client.setDefaultOptions({ queries: { retry: false, staleTime: 60_000 } });
  vi.mocked(getPayments).mockResolvedValue({
    success: true,
    data: {
      rows: [
        {
          id: paymentId,
          classId,
          date: now,
          amount: 1000,
          status: PaymentStatus.PENDING,
          notes: null,
          createdAt: now,
          updatedAt: now,
          class: { name: "Class A", code: null, color: "#3b82f6" },
        },
      ],
    },
  });
  vi.mocked(getPaymentStats).mockResolvedValue({
    success: true,
    data: {
      rowCount: 1,
      totalAmount: 1000,
      paidAmount: 0,
      pendingAmount: 1000,
      cancelledAmount: 0,
    },
  });
  vi.mocked(deletePayments).mockResolvedValue({
    success: true,
    data: { deletedCount: 1 },
  });
  vi.mocked(batchUpdatePaymentsStatus).mockResolvedValue({
    success: true,
    data: { updatedCount: 1 },
  });
});
afterEach(() => {
  cleanup();
  client.clear();
});

it("clears selected rows and refreshes the displayed queries after bulk delete", async () => {
  render(
    <QueryClientProvider client={client}>
      <TableHarness />
    </QueryClientProvider>
  );
  const rowCheckbox = await screen.findByRole("checkbox", {
    name: "Select row",
  });
  fireEvent.click(rowCheckbox);
  // The existing icon buttons expose the selection count as their text.
  fireEvent.click(screen.getAllByRole("button", { name: "1" })[0]);
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  await waitFor(() =>
    expect(deletePayments).toHaveBeenCalledExactlyOnceWith([paymentId])
  );
  await waitFor(() =>
    expect(
      screen
        .getByRole("checkbox", { name: "Select row" })
        .getAttribute("aria-checked")
    ).toBe("false")
  );
  await waitFor(() => expect(getPayments).toHaveBeenCalledTimes(2));
  expect(getPaymentStats).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("clears selected rows and refreshes queries after a bulk status change", async () => {
  render(
    <QueryClientProvider client={client}>
      <TableHarness />
    </QueryClientProvider>
  );
  fireEvent.click(await screen.findByRole("checkbox", { name: "Select row" }));
  fireEvent.click(screen.getAllByRole("button", { name: "1" })[1]);
  fireEvent.keyDown(screen.getByRole("combobox", { name: "New Status" }), {
    key: "ArrowDown",
  });
  fireEvent.keyDown(await screen.findByRole("option", { name: "Paid" }), {
    key: "Enter",
  });
  fireEvent.click(screen.getByRole("button", { name: "Update Status" }));
  await waitFor(() =>
    expect(batchUpdatePaymentsStatus).toHaveBeenCalledExactlyOnceWith(
      [paymentId],
      PaymentStatus.PAID
    )
  );
  await waitFor(() =>
    expect(
      screen
        .getByRole("checkbox", { name: "Select row" })
        .getAttribute("aria-checked")
    ).toBe("false")
  );
  await waitFor(() => expect(getPayments).toHaveBeenCalledTimes(2));
  expect(getPaymentStats).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("dialog")).toBeNull();
});
