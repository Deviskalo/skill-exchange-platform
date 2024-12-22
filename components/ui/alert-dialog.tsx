"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AlertDialogProps {
  children: React.ReactNode;
}

const AlertDialog = ({ children }: AlertDialogProps) => {
  return <Dialog>{children}</Dialog>;
};

const AlertDialogTrigger = DialogTrigger;

interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AlertDialogContent = ({
  children,
  className,
  ...props
}: AlertDialogContentProps) => {
  return (
    <DialogContent className={cn(className)} {...props}>
      {children}
    </DialogContent>
  );
};

const AlertDialogHeader = DialogHeader;
const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

interface AlertDialogActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AlertDialogAction = ({
  children,
  className,
  ...props
}: AlertDialogActionProps) => {
  return (
    <button className={cn(buttonVariants(), className)} {...props}>
      {children}
    </button>
  );
};

interface AlertDialogCancelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AlertDialogCancel = ({
  children,
  className,
  ...props
}: AlertDialogCancelProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
};
