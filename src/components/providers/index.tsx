"use client"

import React, { PropsWithChildren } from "react"
import { ThemeProvider } from "./theme-provider"

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

export default Providers