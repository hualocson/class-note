import { Weekday } from "@/enums";
import { z } from "zod";

const TimeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)");

// Weekly times object: { "MO": { start, end }, ... }
const WeeklyTimesSchema = z.record(
  z
    .string()
    .refine((value) => Object.values(Weekday).includes(value as Weekday), {
      message: "Invalid weekday",
    }),
  z.object({
    start: TimeString,
    end: TimeString,
  })
);

export const classScheduleSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  rrule: z.string().min(1, "Rrule is required"),
  startDate: z.date().min(1, "Start date is required"),
  endDate: z.date().nullable().default(null),
  weeklyTimes: WeeklyTimesSchema.default({}),
});

export type ClassScheduleDataType = z.infer<typeof classScheduleSchema>;

export type ClassScheduleDataInputType = z.input<typeof classScheduleSchema>;
export type ClassScheduleDataOutputType = z.output<typeof classScheduleSchema>;

export const classScheduleDefaultValues: ClassScheduleDataType = {
  classId: "",
  rrule: "",
  startDate: new Date(),
  endDate: null,
  weeklyTimes: {},
};
