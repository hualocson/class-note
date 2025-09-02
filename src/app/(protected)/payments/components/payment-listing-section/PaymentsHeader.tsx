import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaymentsHeaderProps {
  onAddPayment: () => void;
}

const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({ onAddPayment }) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      <div className="flex grow items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Payments</h2>
      </div>
      <Button onClick={onAddPayment}>
        <Plus />
        Add Payment
      </Button>
    </div>
  );
};

export default PaymentsHeader;
