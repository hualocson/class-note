import { useRouter } from "next/navigation";

import { BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaymentsHeaderProps {
  paymentCount: number;
  onAddPayment: () => void;
}

const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({
  paymentCount,
  onAddPayment,
}) => {
  const router = useRouter();
  return (
    <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <div className="flex grow items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Payment Records</h2>
          <p className="text-muted-foreground text-sm">
            {paymentCount} payment{paymentCount !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 *:flex-1">
        <Button variant="outline" onClick={() => router.push("/classes")}>
          <BookOpen className="h-4 w-4" />
          Classes
        </Button>
        <Button onClick={onAddPayment}>
          <Plus />
          Add Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentsHeader;
