import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ 
  value, 
  max, 
  className, 
  showLabel = true,
  size = "md" 
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Pregunta {value} de {max}
          </span>
          <span className="text-sm font-semibold text-primary">
            {percentage}%
          </span>
        </div>
      )}
      <div className={cn(
        "w-full bg-secondary rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full gradient-primary rounded-full progress-bar",
            sizeClasses[size]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
