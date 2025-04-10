import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  showProgress?: boolean;
  className?: string;
  progressColor?: string;
  backgroundColor?: string;
  isCompleted?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 200,
  strokeWidth = 10, // Thinner stroke for elegance
  showProgress = false,
  className,
  progressColor = 'stroke-timer-primary',
  backgroundColor = 'stroke-timer-muted/20', // More subtle background
  isCompleted = false
}) => {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - normalizedProgress);
  
  const center = size / 2;
  
  return (
    <div className={cn("relative", className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className={cn(
          "transform -rotate-90 drop-shadow-sm", 
          isCompleted && "timer-complete-animation"
        )}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          className={cn(backgroundColor)}
        />
        
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-all duration-200 ease-linear",
            progressColor,
            "filter drop-shadow-md"
          )}
        />
        
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth - 5}
          strokeWidth={1}
          fill="transparent"
          className="stroke-timer-primary/10"
        />
      </svg>
      
      {showProgress && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium">{Math.round(normalizedProgress * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
