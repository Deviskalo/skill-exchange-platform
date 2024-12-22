// next-themes.d.ts
declare module "next-themes" {
  import { ReactNode } from "react";

  export interface ThemeProviderProps {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    value?: { [key: string]: string };
    disableTransitionOnChange?: boolean;
    enableSystem?: boolean;
    enableColorScheme?: boolean;
  }

  export const ThemeProvider: React.ComponentType<ThemeProviderProps>;
  export function useTheme(): {
    theme?: string;
    setTheme: (theme: string) => void;
    resolvedTheme?: string;
    systemTheme?: string;
  };
}
