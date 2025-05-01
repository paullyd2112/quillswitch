
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Remove the forcedTheme prop since it's causing the context error
  // when combined with defaultTheme in this app environment
  const { forcedTheme, ...restProps } = props
  
  return (
    <NextThemesProvider 
      {...restProps}
      attribute="class"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
