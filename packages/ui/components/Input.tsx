import { cn } from "../utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={cn("input-field", error && "error", className)}
          {...props}
        />
        {error && <p className="input-error">{error}</p>}
        {hint && !error && <p className="input-hint">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";