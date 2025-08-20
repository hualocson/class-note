"use client";

import { ReactNode, useState } from "react";

import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, Loader2, LogOutIcon } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    await signOutAction();
    setLoading(false);
  };
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
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Button
              variant="ghost"
              size={"icon"}
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <LogOutIcon />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
