"use client";

import React, { PropsWithChildren } from "react";

import { getQueryClient } from "@/app/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "../ui/sonner";
import { ThemeProvider } from "./theme-provider";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = getQueryClient();
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
      <Toaster />
    </>
  );
};

export default Providers;
