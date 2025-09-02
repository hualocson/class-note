import { getListScheduleForAllClasses } from "./class-schedules";
import { getClassSessions } from "./class-sessions";
import { getClasses } from "./classes";
import { getPayments } from "./payments";

export type GetClassSessionsResponse = Awaited<
  ReturnType<typeof getClassSessions>
>;

export type GetClassSessionsSuccessResponseData = Extract<
  GetClassSessionsResponse,
  {
    success: true;
  }
>["data"];

export type GetAllClassSchedulesSuccessResponse = Awaited<
  ReturnType<typeof getListScheduleForAllClasses>
>;

export type GetAllClassSchedulesSuccessResponseData = Extract<
  GetAllClassSchedulesSuccessResponse,
  {
    success: true;
  }
>["data"];

// payments
export type GetPaymentsResponse = Awaited<ReturnType<typeof getPayments>>;
export type GetPaymentsSuccessResponseData = Extract<
  GetPaymentsResponse,
  {
    success: true;
  }
>["data"];

export type GetClassesResponse = Awaited<ReturnType<typeof getClasses>>;
export type GetClassesSuccessResponseData = Extract<
  GetClassesResponse,
  {
    success: true;
  }
>["data"];
