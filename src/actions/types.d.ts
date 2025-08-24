import { getListScheduleForAllClasses } from "./class-schedules";
import { getClassSessions } from "./class-sessions";

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
