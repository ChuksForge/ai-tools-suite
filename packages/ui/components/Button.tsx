import { cn } from "../utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "btn",
          variant === "primary" && "btn-primary",
          variant === "secondary" && "btn-secondary",
          fullWidth && "btn-full",
          className
        )}
        style={{ height: size === "sm" ? "2rem" : size === "lg" ? "3rem" : "2.5rem" }}
        {...props}
      >
        {loading && (
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="loader-spinner loader-sm" />
          </span>
        )}
        <span style={{ visibility: loading ? "hidden" : "visible" }}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";