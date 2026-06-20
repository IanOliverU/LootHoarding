"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;

export function DialogContent({
  className,
  overlayClassName,
  children,
  ...props
}: DialogPrimitive.DialogContentProps & { overlayClassName?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={cn("fixed inset-0 z-[100] bg-black/70 backdrop-blur-[2px]", overlayClassName)} />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border border-line bg-card px-9 py-10 text-center shadow-soft outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title className={cn("font-display text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: DialogPrimitive.DialogDescriptionProps) {
  return <DialogPrimitive.Description className={cn("text-[0.8rem] text-ink-dim", className)} {...props} />;
}
