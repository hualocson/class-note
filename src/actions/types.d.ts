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
