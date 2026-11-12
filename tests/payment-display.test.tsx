// @vitest-environment jsdom
import React from "react";

import PaymentStatsSection from "@/app/(protected)/payments/components/PaymentStatsSeciton";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { Calendar } from "@/components/ui/calendar";

afterEach(cleanup);

it("shows a retryable stats error instead of zero-value cards", () => {
  const retry = vi.fn();
  render(
    <PaymentStatsSection
      data={undefined}
      isLoading={false}
      error={new Error("Unavailable")}
      onRetry={retry}
    />
  );
  expect(screen.getByRole("alert").textContent).toContain(
    "Unable to load payment statistics."
  );
  expect(screen.queryByText("Total Amount")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Retry statistics" }));
  expect(retry).toHaveBeenCalledTimes(1);
});

it("applies grid sizing through the installed calendar API", () => {
  render(<Calendar month={new Date("2026-11-01T00:00:00Z")} />);
  expect(screen.getByRole("grid").classList.contains("w-full")).toBe(true);
});
