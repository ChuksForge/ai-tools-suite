import { cn } from "../utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-3 py-2.5 bg-transparent border font-body text-sm text-foreground resize-none",
            "placeholder:text-muted-foreground",
            "transition-colors duration-150",
            "focus:outline-none focus:border-[#0066FF]",
            error
              ? "border-[#FF3333]"
              : "border-border hover:border-[#A8A8A8]",
            className
          )}
          {...props}
        />
        {error && <p className="font-mono text-xs text-[#FF3333]">{error}</p>}
        {hint && !error && (
          <p className="font-mono text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";