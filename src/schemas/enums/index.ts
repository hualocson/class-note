import { PaymentStatus, SessionStatus } from "@/enums";
import { pgEnum } from "drizzle-orm/pg-core";

export const sessionStatusEnum = pgEnum("session_status", [
  SessionStatus.PLANNED,
  SessionStatus.FINISHED,
  SessionStatus.CANCELLED,
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  PaymentStatus.PENDING,
  PaymentStatus.PAID,
  PaymentStatus.CANCELLED,
]);
