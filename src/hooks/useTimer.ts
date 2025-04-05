
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { TimerSection, TimerState } from '@/types/timer';

export function useTimer(initialSections: TimerSection[]) {
  const [timerState, setTimerState] = useState<TimerState>({
    sections: initialSections,
    currentSectionIndex: 0,
    isRunning: false,
    isCompleted: false,
    totalTimeInSeconds: initialSections.reduce((sum, section) => sum + section.timeInSeconds, 0)
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

  const handleSetPourAmount = (sectionIndex: number, amount: number) => {
    if (amount < 0) return;
    
    setTimerState(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        pourAmount: amount
      };
      
      return {
        ...prev,
        sections: updatedSections,
        isRunning: false,
        isCompleted: false
      };
    });
    
    toast({
      title: "Pour amount updated",
      description: `Updated to ${amount} ml`,
      duration: 2000,
    });
  };

  const updateSections = (newSections: TimerSection[]) => {
    setTimerState(prev => ({
      ...prev,
      sections: newSections,
      currentSectionIndex: 0,
      isRunning: false,
      isCompleted: false,
      totalTimeInSeconds: newSections.reduce((sum, section) => sum + section.timeInSeconds, 0)
    }));
    setTimeRemaining(newSections[0].timeInSeconds);
  };

  const currentSection = timerState.sections[timerState.currentSectionIndex];
  const progress = currentSection.timeInSeconds > 0 
    ? (currentSection.timeInSeconds - timeRemaining) / currentSection.timeInSeconds 
    : 0;

  return {
    timerState,
    timeRemaining,
    currentSection,
    progress,
    handleStart,
    handlePause,
    handleReset,
    handleSetTime,
    handleSetPourAmount,
    updateSections
  };
}
