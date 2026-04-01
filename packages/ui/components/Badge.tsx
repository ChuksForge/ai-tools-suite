import { cn } from "../utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-xs uppercase tracking-wider border",
        variant === "default" && "bg-muted text-muted-foreground border-border",
        variant === "success" && "bg-[#00FF881A] text-[#00FF88] border-[#00FF88]",
        variant === "warning" && "bg-[#FFB8001A] text-[#FFB800] border-[#FFB800]",
        variant === "error" && "bg-[#FF33331A] text-[#FF3333] border-[#FF3333]",
        variant === "info" && "bg-[#0066FF1A] text-[#0066FF] border-[#0066FF]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}