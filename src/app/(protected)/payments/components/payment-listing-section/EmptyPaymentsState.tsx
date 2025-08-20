import { DollarSignIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyPaymentsStateProps {
  onAddPayment: () => void;
}

const EmptyPaymentsState: React.FC<EmptyPaymentsStateProps> = ({
  onAddPayment,
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <DollarSignIcon className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">No payments yet</h3>
        <p className="text-muted-foreground mb-4 text-center">
          Start tracking your class payments by adding your first payment
          record.
        </p>
        <Button onClick={onAddPayment}>
          <Plus className="mr-2 h-4 w-4" />
          Add First Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyPaymentsState;
