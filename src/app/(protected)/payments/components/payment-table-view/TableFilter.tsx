import { GetClassesSuccessResponseData } from "@/actions/types";
import { PaymentStatus } from "@/enums";
import { FacetedFilter } from "@tanstack/react-table";

import { PaymentType } from "./type";

const paymentStatusFilter: FacetedFilter<PaymentType> = {
  key: "status",
  singleData: {
    label: "Status",
    options: [
      { value: PaymentStatus.PENDING, label: "Pending" },
      { value: PaymentStatus.PAID, label: "Paid" },
      { value: PaymentStatus.CANCELLED, label: "Cancelled" },
    ],
    multiple: true,
  },
};

const genClassFilter: (
  classes: GetClassesSuccessResponseData["rows"]
) => FacetedFilter<PaymentType> = (classes) => ({
  key: "class",
  singleData: {
    label: "Class",
    options: classes.map((classItem) => ({
      value: classItem.id,
      label: classItem.name,
    })),
    multiple: true,
  },
  multiple: true,
});

export { genClassFilter, paymentStatusFilter };
