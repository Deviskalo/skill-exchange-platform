// radix-ui-alert-dialog.d.ts
declare module "@radix-ui/react-alert-dialog" {
  import React from "react";

  export interface AlertDialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
  }

  export const Root: React.ComponentType<AlertDialogProps>;
  export const Trigger: React.ComponentType<
    React.HTMLAttributes<HTMLButtonElement>
  >;
  export const Portal: React.ComponentType<{ children: React.ReactNode }>;
  export const Overlay: React.ComponentType<
    React.HTMLAttributes<HTMLDivElement>
  >;
  export const Content: React.ComponentType<
    React.HTMLAttributes<HTMLDivElement>
  >;
  export const Title: React.ComponentType<
    React.HTMLAttributes<HTMLHeadingElement>
  >;
  export const Description: React.ComponentType<
    React.HTMLAttributes<HTMLParagraphElement>
  >;
  export const Cancel: React.ComponentType<
    React.HTMLAttributes<HTMLButtonElement>
  >;
  export const Action: React.ComponentType<
    React.HTMLAttributes<HTMLButtonElement>
  >;
}
