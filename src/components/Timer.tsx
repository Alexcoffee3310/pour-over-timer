import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import CircularProgress from './CircularProgress';
import TimerControls from './TimerControls';
import { formatTime } from '@/utils/time-formatter';
import { TimerSection, TimerState } from '@/types/timer';

interface TimerProps {
  initialTimeInSeconds?: number;
}

const Timer: React.FC<TimerProps> = ({ initialTimeInSeconds = 60 }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    sections: [
      { name: 'Bloom', timeInSeconds: 30, type: 'pour' },
      { name: 'Bloom Sit', timeInSeconds: 45, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 60, type: 'pour' },
      { name: '1st Pour Sit', timeInSeconds: 45, type: 'sit' },
      { name: '2nd Pour', timeInSeconds: 90, type: 'pour' },
      { name: '2nd Pour Sit', timeInSeconds: 45, type: 'sit' }
    ],
    currentSectionIndex: 0,
    isRunning: false,
    isCompleted: false,
    totalTimeInSeconds: 315
  });
  
  const [timeRemaining, setTimeRemaining] = useState(timerState.sections[0].timeInSeconds);
  const { toast } = useToast();
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const total = timerState.sections.reduce((sum, section) => sum + section.timeInSeconds, 0);
    setTimerState(prev => ({
      ...prev,
      totalTimeInSeconds: total
    }));
  }, [timerState.sections]);
  
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeRemaining(timerState.sections[timerState.currentSectionIndex].timeInSeconds);
  }, [timerState.currentSectionIndex, timerState.sections]);
  
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            const nextSectionIndex = timerState.currentSectionIndex + 1;
            
            if (nextSectionIndex < timerState.sections.length) {
              setTimerState(prev => ({
                ...prev,
                currentSectionIndex: nextSectionIndex
              }));
              
              if (audioRef.current) {
                audioRef.current.play().catch(error => 
                  console.error("Audio playback failed:", error)
                );
              }
              
              const currentSection = timerState.sections[timerState.currentSectionIndex];
              const nextSection = timerState.sections[nextSectionIndex];
              toast({
                title: `${currentSection.name} completed!`,
                description: `Moving to ${nextSection.name}`,
                duration: 3000,
              });
              
              return timerState.sections[nextSectionIndex].timeInSeconds;
            } else {
              clearInterval(intervalRef.current!);
              setTimerState(prev => ({
                ...prev,
                isRunning: false,
                isCompleted: true
              }));
              
              if (audioRef.current) {
                audioRef.current.play().catch(error => 
                  console.error("Audio playback failed:", error)
                );
              }
              
              toast({
                title: "All sections completed!",
                description: "Your pour over is ready.",
                duration: 5000,
              });
              
              return 0;
            }
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
  }, [timerState.isRunning, timerState.currentSectionIndex, timerState.sections, toast]);
  
  const handleStart = () => {
    if (timeRemaining > 0) {
      setTimerState(prev => ({
        ...prev,
        isRunning: true,
        isCompleted: false
      }));
    }
  };
  
  const handlePause = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  };
  
  const handleReset = () => {
    setTimerState(prev => ({
      ...prev,
      currentSectionIndex: 0,
      isRunning: false,
      isCompleted: false
    }));
    setTimeRemaining(timerState.sections[0].timeInSeconds);
  };
  
  const handleSetTime = (sectionIndex: number, seconds: number) => {
    if (seconds <= 0) return;
    
    setTimerState(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        timeInSeconds: seconds
      };
      
      const totalTime = updatedSections.reduce(
        (sum, section) => sum + section.timeInSeconds,
        0
      );
      
      return {
        ...prev,
        sections: updatedSections,
        isRunning: false,
        isCompleted: false,
        totalTimeInSeconds: totalTime
      };
    });
    
    if (sectionIndex === timerState.currentSectionIndex) {
      setTimeRemaining(seconds);
    }
  };
  
  const currentSection = timerState.sections[timerState.currentSectionIndex];
  const progress = currentSection.timeInSeconds > 0 
    ? (currentSection.timeInSeconds - timeRemaining) / currentSection.timeInSeconds 
    : 0;
  
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <CircularProgress 
          progress={progress} 
          size={280} 
          strokeWidth={16} 
          isCompleted={timerState.isCompleted}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium text-timer-text/70 mb-1">
              {currentSection.name}
              {currentSection.type === 'sit' && (
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
                  Wait
                </span>
              )}
            </div>
            <div className="text-4xl font-bold text-timer-text mb-1">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-timer-text/70">
              {timerState.isRunning ? 'Counting down...' : timerState.isCompleted ? 'Completed!' : 'Ready'}
            </div>
            <div className="text-xs text-timer-text/70 mt-1">
              Step {timerState.currentSectionIndex + 1} of {timerState.sections.length}
            </div>
            <div className="text-xs text-timer-text/70 mt-1">
              Total brew time: {formatTime(timerState.totalTimeInSeconds || 0)}
            </div>
          </div>
        </div>
      </div>
      
      <TimerControls
        sections={timerState.sections}
        isRunning={timerState.isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSetTime={handleSetTime}
      />
    </div>
  );
};

export default Timer;
