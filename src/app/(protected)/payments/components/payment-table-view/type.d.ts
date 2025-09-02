import type { GetPaymentsSuccessResponseData } from "@/actions/types";

export type PaymentType = GetPaymentsSuccessResponseData["rows"][number];
