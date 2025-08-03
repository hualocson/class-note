import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentCardSkeleton: React.FC = () => {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden">
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            {/* Amount skeleton */}
            <Skeleton className="h-7 w-24" />
            <div className="flex flex-col gap-1">
              {/* Date skeleton */}
              <Skeleton className="h-4 w-20" />
              {/* Status badge skeleton */}
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          {/* Actions skeleton */}
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        {/* Notes skeleton - randomly show for some cards */}
        <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </div>

        {/* Class info skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-8" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentsLoadingState: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PaymentCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default PaymentsLoadingState;
