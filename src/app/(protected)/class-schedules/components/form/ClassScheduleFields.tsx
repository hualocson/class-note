"use client";

import { useMemo } from "react";

import { Weekday } from "@/enums";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RRule } from "rrule";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ClassesSelect from "@/components/common/ClassesSelect";

import RRuleStringBuilderField from "./RRuleStringBuilderField";
import {
  ClassScheduleDataInputType,
  ClassScheduleDataOutputType,
} from "./schema";

interface IClassScheduleFieldsProps {
  form: UseFormReturn<
    ClassScheduleDataInputType,
    unknown,
    ClassScheduleDataOutputType
  >;
}

const ClassScheduleFields = ({ form }: IClassScheduleFieldsProps) => {
  const rrule = form.watch("rrule");
  const rruleParsed = RRule.fromString(rrule).options.byweekday;

  const weekdayOptions = useMemo(() => {
    const options = [
      { id: 0, value: Weekday.MONDAY, label: "Monday" },
      { id: 1, value: Weekday.TUESDAY, label: "Tuesday" },
      { id: 2, value: Weekday.WEDNESDAY, label: "Wednesday" },
      { id: 3, value: Weekday.THURSDAY, label: "Thursday" },
      { id: 4, value: Weekday.FRIDAY, label: "Friday" },
      { id: 5, value: Weekday.SATURDAY, label: "Saturday" },
      { id: 6, value: Weekday.SUNDAY, label: "Sunday" },
    ];
    if (!rruleParsed) {
      return options;
    }

    return options.filter((option) => rruleParsed.includes(option.id));
  }, [rruleParsed]);

  const addWeekdayTime = (weekday: Weekday) => {
    const currentWeeklyTimes = form.getValues("weeklyTimes");
    const newWeeklyTimes = currentWeeklyTimes
      ? {
          ...currentWeeklyTimes,
          [weekday]: {
            start: "09:00",
            end: "10:00",
          },
        }
      : { [weekday]: { start: "09:00", end: "10:00" } };
    form.setValue(
      "weeklyTimes",
      newWeeklyTimes as
        | Record<Weekday, { start: string; end: string }>
        | undefined
    );
  };

  const removeWeekdayTime = (weekday: Weekday) => {
    const currentWeeklyTimes = form.getValues("weeklyTimes");
    if (!currentWeeklyTimes) {
      return;
    }

    const { [weekday]: removed, ...remainingWeeklyTimes } = currentWeeklyTimes;
    const newWeeklyTimes =
      Object.keys(remainingWeeklyTimes).length > 0
        ? remainingWeeklyTimes
        : null;

    form.setValue(
      "weeklyTimes",
      newWeeklyTimes as
        | Record<Weekday, { start: string; end: string }>
        | undefined
    );
  };

  const weeklyTimes = form.watch("weeklyTimes") || {};
  const configuredWeekdays = Object.keys(weeklyTimes) as Weekday[];
  const availableWeekdays = weekdayOptions.filter(
    (option) => !configuredWeekdays.includes(option.value)
  );

  return (
    <>
      {/* Class Selection */}
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class *</FormLabel>
            <FormControl>
              <ClassesSelect value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* RRULE */}
      <FormField
        control={form.control}
        name="rrule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recurrence Rule *</FormLabel>
            <FormControl>
              <RRuleStringBuilderField
                rrule={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Start Date */}
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date *</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* End Date */}
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date (Optional)</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const startDate = form.getValues("startDate");
                      return (
                        date < new Date("1900-01-01") ||
                        (startDate && date < startDate)
                      );
                    }}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Weekly Times */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Weekly Schedule</FormLabel>
          {availableWeekdays.length > 0 && (
            <Select onValueChange={addWeekdayTime}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Add weekday">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Weekday
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableWeekdays.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {configuredWeekdays.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No weekly schedule configured.
          </p>
        )}

        {configuredWeekdays.map((weekday) => (
          <div key={weekday} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {weekdayOptions.find((opt) => opt.value === weekday)?.label}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeWeekdayTime(weekday)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Start Time */}
              <FormField
                control={form.control}
                name={`weeklyTimes.${weekday}.start`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name={`weeklyTimes.${weekday}.end`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClassScheduleFields;
