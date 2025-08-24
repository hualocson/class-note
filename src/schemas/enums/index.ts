import { PaymentStatus, SessionStatus, Weekday } from "@/enums";
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

export const weekdayEnum = pgEnum("weekday", [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
  Weekday.SUNDAY,
]);
