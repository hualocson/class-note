import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "../ui/button";
import ThemeToggleButton from "./ThemeToggleButton";

interface PageHeaderProps {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  onBack?: () => void;
}

export default function PageHeader({
  title,
  icon,
  children,
  className = "",
  onBack,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-background/80 border-border/50 sticky top-0 z-50 border-b backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" onClick={onBack} size={"icon"}>
              <ArrowLeftIcon />
            </Button>
          )}
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h1 className="text-primary text-lg font-medium">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {children}
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
