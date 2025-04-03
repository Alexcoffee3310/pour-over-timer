
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import CircularProgress from './CircularProgress';
import TimerControls from './TimerControls';
import { formatTime } from '@/utils/time-formatter';

interface TimerProps {
  initialTimeInSeconds?: number;
}

const Timer: React.FC<TimerProps> = ({ initialTimeInSeconds = 60 }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeInSeconds);
  const [initialTime, setInitialTime] = useState(initialTimeInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create an audio element for the timer completion sound
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Timer complete
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            
            // Play sound
            if (audioRef.current) {
              audioRef.current.play().catch(error => 
                console.error("Audio playback failed:", error)
              );
            }
            
            // Show notification
            toast({
              title: "Time's up!",
              description: "Your countdown timer has completed.",
              duration: 5000,
            });
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, toast]);
  
  const handleStart = () => {
    if (timeRemaining > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  };
  
  const handlePause = () => {
    setIsRunning(false);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
    setIsCompleted(false);
  };
  
  const handleSetTime = (seconds: number) => {
    setTimeRemaining(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
    setIsCompleted(false);
  };
  
  // Calculate progress (0 to 1)
  const progress = initialTime > 0 ? (initialTime - timeRemaining) / initialTime : 0;
  
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <CircularProgress 
          progress={progress} 
          size={280} 
          strokeWidth={16} 
          isCompleted={isCompleted}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-timer-text mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-timer-text/70">
              {isRunning ? 'Counting down...' : isCompleted ? 'Completed!' : 'Ready'}
            </div>
          </div>
        </div>
      </div>
      
      <TimerControls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSetTime={handleSetTime}
      />
    </div>
  );
};

export default Timer;
