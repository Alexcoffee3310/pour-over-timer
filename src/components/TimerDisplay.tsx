
import React from 'react';
import { formatTime } from '@/utils/time-formatter';
import CircularProgress from './CircularProgress';
import { TimerSection } from '@/types/timer';

interface TimerDisplayProps {
  currentSection: TimerSection;
  timeRemaining: number;
  progress: number;
  isRunning: boolean;
  isCompleted: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  currentSection,
  timeRemaining,
  progress,
  isRunning,
  isCompleted
}) => {
  return (
    <div className="flex justify-center mb-1">
      <div className="relative">
        <CircularProgress 
          progress={progress} 
          size={150} 
          strokeWidth={10} 
          isCompleted={isCompleted}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-medium text-timer-text/70 uppercase tracking-wider mb-1">
              {currentSection.name}
            </div>
            <div className="text-3xl font-light text-timer-text mb-1">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-timer-text/70 tracking-wide">
              {isRunning ? 'Brewing...' : isCompleted ? 'Completed' : 'Ready'}
            </div>
            {currentSection.pourAmount && currentSection.type === 'pour' && (
              <div className="text-xs text-timer-primary font-medium mt-1 bg-timer-primary/5 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {currentSection.pourAmount} ml
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
