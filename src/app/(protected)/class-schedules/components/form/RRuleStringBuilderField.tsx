"use client";

import { Weekday } from "@/enums";
import { cn } from "@/lib/utils";
import { ALL_WEEKDAYS, ByWeekday, RRule } from "rrule";

interface IRRuleStringBuilderField {
  rrule: string;
  onChange: (rrule: string) => void;
}

const RRuleStringBuilderField: React.FC<IRRuleStringBuilderField> = ({
  rrule,
  onChange,
}) => {
  // list of weekdays, allow user to select weekdays like checkbox group
  const weekdays = Object.values(Weekday);

  // Parse selected weekdays from rrule string using rrule lib
  const getSelectedWeekdays = () => {
    try {
      if (!rrule) {
        return [];
      }

      const parsedRule = RRule.fromString(rrule);
      const byweekday = parsedRule.options.byweekday;

      if (!byweekday) {
        return [];
      }

      return byweekday
        .map((day) => {
          return ALL_WEEKDAYS[day];
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error parsing rrule:", error);
      return [];
    }
  };

  const selectedWeekdays = getSelectedWeekdays();

  const handleWeekdayToggle = (weekday: Weekday) => {
    const currentSelected = getSelectedWeekdays();
    let newSelected;

    if (currentSelected.includes(weekday)) {
      newSelected = currentSelected.filter((w) => w !== weekday);
    } else {
      newSelected = [...currentSelected, weekday];
    }

    // Generate new rrule string using RRule lib
    try {
      let newRrule: string;

      if (newSelected.length > 0) {
        // Map our Weekday enum to RRule weekday constants
        const rruleWeekdays = newSelected
          .map((day) => {
            switch (day) {
              case Weekday.MONDAY:
                return RRule.MO;
              case Weekday.TUESDAY:
                return RRule.TU;
              case Weekday.WEDNESDAY:
                return RRule.WE;
              case Weekday.THURSDAY:
                return RRule.TH;
              case Weekday.FRIDAY:
                return RRule.FR;
              case Weekday.SATURDAY:
                return RRule.SA;
              case Weekday.SUNDAY:
                return RRule.SU;
              default:
                return null;
            }
          })
          .filter(Boolean);

        // Create new RRule with selected weekdays
        const rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: rruleWeekdays as ByWeekday[],
        });

        newRrule = rule.toString();
      } else {
        newRrule = "";
      }

      onChange(newRrule);
    } catch (error) {
      console.error("Error generating rrule:", error);
      // Fallback to basic weekly rule
      const rule = new RRule({
        freq: RRule.WEEKLY,
      });
      onChange(rule.toString());
    }
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((weekday) => {
          const isSelected = selectedWeekdays.includes(weekday);
          return (
            <label
              key={weekday}
              className={cn(
                "w-full cursor-pointer rounded-md py-2 text-center text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => handleWeekdayToggle(weekday)}
              />
              {weekday}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RRuleStringBuilderField;
