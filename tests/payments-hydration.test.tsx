// @vitest-environment jsdom
import React from "react";

import { getClasses } from "@/actions/classes";
import { getPaymentStats, getPayments } from "@/actions/payments";
import PaymentListingSection from "@/app/(protected)/payments/components/payment-listing-section/PaymentListingSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, waitFor, within } from "@testing-library/react";
import { type Root, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

// A pending server prefetch can settle before the browser starts hydration.
// Mock only the action boundary; render and hydrate the actual listing and filters.
vi.mock("@/actions/classes", () => ({
  getClasses: vi.fn(() => new Promise(() => {})),
}));
vi.mock("@/actions/payments", () => ({
  getPayments: vi.fn(() => new Promise(() => {})),
  getPaymentStats: vi.fn(() => new Promise(() => {})),
  createPayment: vi.fn(),
  updatePayment: vi.fn(),
  deletePayment: vi.fn(),
  deletePayments: vi.fn(),
  batchUpdatePaymentsStatus: vi.fn(),
}));

let root: Root | undefined;
const clients: QueryClient[] = [];
beforeEach(() => vi.clearAllMocks());
afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  document.body.innerHTML = "";
});

it("hydrates without changing filter markup when classes resolve before hydration", async () => {
  const serverClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: false } },
  });
  const browserClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: false } },
  });
  clients.push(serverClient, browserClient);
  const container = document.createElement("div");
  container.innerHTML = renderToString(
    <QueryClientProvider client={serverClient}>
      <PaymentListingSection />
    </QueryClientProvider>
  );
  document.body.append(container);
  browserClient.setQueryData(["classes"], {
    rows: [
      {
        id: "10000000-0000-4000-8000-000000000001",
        name: "Class A",
        code: null,
        color: "#3b82f6",
        price: 1000,
        sortOrder: 0,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date("2026-11-01T00:00:00Z"),
        updatedAt: new Date("2026-11-01T00:00:00Z"),
      },
    ],
    rowCount: 1,
  });
  const recoverableErrors: unknown[] = [];
  await act(async () => {
    root = hydrateRoot(
      container,
      <QueryClientProvider client={browserClient}>
        <PaymentListingSection />
      </QueryClientProvider>,
      { onRecoverableError: (error) => recoverableErrors.push(error) }
    );
  });
  expect(recoverableErrors).toEqual([]);
  expect(
    within(container).getByRole("button", { name: "Class" })
  ).toBeDefined();
});

it("starts both payment queries while the classes prefetch is still pending", async () => {
  const browserClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: false } },
  });
  clients.push(browserClient);
  const listing = render(
    <QueryClientProvider client={browserClient}>
      <PaymentListingSection />
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(getClasses).toHaveBeenCalledTimes(1);
    expect(getPayments).toHaveBeenCalledTimes(1);
    expect(getPaymentStats).toHaveBeenCalledTimes(1);
  });
  expect(
    within(listing.container).getByRole("button", { name: "Status" })
  ).toBeDefined();
  expect(
    within(listing.container).queryByRole("button", { name: "Class" })
  ).toBeNull();
});
