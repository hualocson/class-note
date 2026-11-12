"use client";

import * as React from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Keep the bootstrap script executable during SSR.
  // Prevent React 19 from treating it as an executable script
  // during client rendering.
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : { type: "application/json" as const };

  return <NextThemesProvider {...props} scriptProps={scriptProps}>{children}</NextThemesProvider>;
}
