"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { BookOpen, Calendar, CreditCard, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Sessions",
    href: "/class-sessions",
    icon: Calendar,
  },
  {
    name: "Classes",
    href: "/classes",
    icon: BookOpen,
  },

  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border/50 safe-area-top safe-area-bottom fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Button
                key={item.name}
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "group relative flex size-20 flex-col items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                aria-label={`Navigate to ${item.name}`}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <Icon
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isActive && "scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs leading-none font-medium transition-all duration-200",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="bg-primary absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 transform rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
