import { Plus, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaymentsHeaderProps {
  paymentCount: number;
  onRefresh: () => void;
  onAddPayment: () => void;
}

const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({
  paymentCount,
  onRefresh,
  onAddPayment,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Payment Records</h2>
        <p className="text-muted-foreground text-sm">
          {paymentCount} payment{paymentCount !== 1 ? "s" : ""} found
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button onClick={onAddPayment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentsHeader;
