import { getClasses } from "@/actions/classes";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "../getQueryClient";

const HydratedClasses = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const result = await getClasses();

      if (!result.success) {
        throw new Error(result.error || "Failed to load classes");
      }

      return result.data;
    },
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};
export default HydratedClasses;
