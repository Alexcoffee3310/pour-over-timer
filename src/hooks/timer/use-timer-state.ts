
import { useState } from 'react';
import { TimerSection, TimerState } from '@/types/timer';
import { calculateTotalTime } from '@/utils/time-formatter';

export function useTimerState(initialSections: TimerSection[]) {
  const [timerState, setTimerState] = useState<TimerState>({
    sections: initialSections,
    currentSectionIndex: 0,
    isRunning: false,
    isCompleted: false,
    totalTimeInSeconds: calculateTotalTime(initialSections)
  });
  
  const updateSections = (newSections: TimerSection[]) => {
    const totalTime = calculateTotalTime(newSections);
    
    setTimerState(prev => ({
      ...prev,
      sections: newSections,
      currentSectionIndex: 0,
      isRunning: false,
      isCompleted: false,
      totalTimeInSeconds: totalTime
    }));
  };
  
  const startTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isCompleted: false
    }));
  };
  
  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  };
  
  const resetTimer = () => {
    setTimerState(prev => ({
      ...prev,
      currentSectionIndex: 0,
      isRunning: false,
      isCompleted: false
    }));
  };
  
  const completeTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isCompleted: true
    }));
  };
  
  const moveToNextSection = () => {
    setTimerState(prev => ({
      ...prev,
      currentSectionIndex: prev.currentSectionIndex + 1
    }));
  };
  
  const updateSectionTime = (sectionIndex: number, seconds: number) => {
    if (seconds <= 0) return;
    
    setTimerState(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        timeInSeconds: seconds
      };
      
      const totalTime = calculateTotalTime(updatedSections);
      
      return {
        ...prev,
        sections: updatedSections,
        isRunning: false,
        isCompleted: false,
        totalTimeInSeconds: totalTime
      };
    });
  };
  
  const updatePourAmount = (sectionIndex: number, amount: number) => {
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
  };
  
  return {
    timerState,
    updateSections,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    moveToNextSection,
    updateSectionTime,
    updatePourAmount
  };
}
