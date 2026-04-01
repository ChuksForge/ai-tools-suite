import { cn } from "../utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Loader({ size = "md", label, className }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "border-2 border-border border-t-[#0066FF] rounded-full animate-spin",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-12 w-12"
        )}
      />
      {label && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
    </div>
  );
}