import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaymentsHeaderProps {
  paymentCount: number;
  onAddPayment: () => void;
}

const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({
  paymentCount,
  onAddPayment,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      <div className="flex grow items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Payment Records</h2>
          <p className="text-muted-foreground text-sm">
            {paymentCount} payment{paymentCount !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>
      <Button onClick={onAddPayment}>
        <Plus />
        Add Payment
      </Button>
    </div>
  );
};

export default PaymentsHeader;
