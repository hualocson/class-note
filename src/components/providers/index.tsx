"use client";

import React, { PropsWithChildren } from "react";

import { Toaster } from "../ui/sonner";
import { ThemeProvider } from "./theme-provider";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Toaster />
    </>
  );
};

export default Providers;
