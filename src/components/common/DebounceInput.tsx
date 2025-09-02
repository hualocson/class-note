"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import { Input } from "@/components/ui/input";

export default function DebounceInput({
  defaultValue = "",
  delay = 500,
  fetching = false,
  onDebounceValueChange,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  defaultValue?: string;
  delay?: number;
  fetching?: boolean;
  icon?: React.ReactNode;
  onDebounceValueChange?: (value: string) => void;
}) {
  const [debouncedValue, setValue] = useDebounceValue(defaultValue, delay);

  useEffect(() => {
    onDebounceValueChange?.(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="relative">
      {icon && (
        <span className="absolute top-1/2 left-2 -translate-y-1/2">{icon}</span>
      )}
      <Input
        type="text"
        defaultValue={defaultValue}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        {...props}
        className={cn(props.className, icon && "pl-8")}
      />
      <span
        className={cn(
          "absolute top-1/2 right-2 -translate-y-1/2 transition-opacity duration-300",
          {
            "opacity-0": !fetching,
          }
        )}
      >
        <Loader2 className={"text-primary-500 h-4 w-4 animate-spin"} />
      </span>
    </div>
  );
}
