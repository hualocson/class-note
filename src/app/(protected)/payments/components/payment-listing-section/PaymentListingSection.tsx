"use client";

import { useState, useSyncExternalStore } from "react";

import useClassesQuery from "@/hooks/useClassesQuery";
import usePaymentActions from "@/hooks/usePaymentActions";
import usePaymentsQuery from "@/hooks/usePaymentsQuery";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import PaymentDialog from "../PaymentDialog";
import PaymentStatsSection from "../PaymentStatsSeciton";
import { PaymentDataType } from "../form/schema";
import PaymentTable from "../payment-table-view/PaymentTable";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const PaymentListingSection: React.FC = () => {
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    id?: string;
    data: PaymentDataType;
  } | null>(null);
  const { deletePaymentMutation } = usePaymentActions();
  const classesQuery = useClassesQuery();
  const paymentsQuery = usePaymentsQuery();

  // Prefetched queries can settle between SSR and hydration. Start queries above,
  // but keep the first render identical until React has hydrated this listing.
  if (!hasHydrated) {
    return (
      <div
        role="status"
        className="text-muted-foreground flex items-center justify-center gap-2 py-24 text-sm"
      >
        <Loader2Icon className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PaymentStatsSection
        data={paymentsQuery.summaryQuery.data}
        isLoading={paymentsQuery.summaryQuery.isPending}
        error={paymentsQuery.summaryQuery.error}
        onRetry={() => {
          void paymentsQuery.summaryQuery.refetch();
        }}
      />
      {classesQuery.isError && (
        <div role="alert" className="mb-4 space-y-2">
          <p>Unable to load class options.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void classesQuery.refetch();
            }}
          >
            Retry classes
          </Button>
        </div>
      )}
      <PaymentTable
        query={paymentsQuery}
        classes={classesQuery.data?.rows ?? []}
        canManagePayments={classesQuery.isSuccess}
        onAddPayment={() => {
          setSelectedPayment(null);
          setIsDialogOpen(true);
        }}
        onDeletePayment={(id) => {
          deletePaymentMutation.mutate(id, {
            onSuccess: () => setIsDialogOpen(false),
          });
        }}
        onEditPayment={(payment) => {
          setSelectedPayment({
            id: payment.id,
            data: {
              date: payment.date.toISOString(),
              classId: payment.classId,
              amount: payment.amount,
              status: payment.status,
              notes: payment.notes ?? undefined,
            },
          });
          setIsDialogOpen(true);
        }}
      />
      <PaymentDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={selectedPayment ?? undefined}
      />
    </>
  );
};

export default PaymentListingSection;
