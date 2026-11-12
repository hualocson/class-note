import type { QueryClient } from "@tanstack/react-query";

export async function invalidatePaymentQueries(
  queryClient: QueryClient
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["payments-table"],
      refetchType: "active",
    }),
    queryClient.invalidateQueries({
      queryKey: ["payment-stats"],
      refetchType: "active",
    }),
  ]);
}
