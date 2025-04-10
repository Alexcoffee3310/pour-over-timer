
import { useTimerState } from './use-timer-state';
import { useCountdown } from './use-countdown';
import { TimerSection } from '@/types/timer';
import { useToast } from '@/components/ui/use-toast';

export function useTimer(initialSections: TimerSection[]) {
  const {
    timerState,
    updateSections,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    moveToNextSection,
    updateSectionTime,
    updatePourAmount
  } = useTimerState(initialSections);

  const { toast } = useToast();
  
  const { timeRemaining } = useCountdown(
    timerState.sections,
    timerState.currentSectionIndex,
    timerState.isRunning,
    moveToNextSection,
    completeTimer
  );
  
  const handleStart = () => {
    if (timeRemaining > 0) {
      startTimer();
    }
  };
  
  const handlePause = () => {
    pauseTimer();
  };
  
  const handleReset = () => {
    resetTimer();
  };
  
  const handleRestart = () => {
    resetTimer();
    startTimer();
  };
  
  const handleSetTime = (sectionIndex: number, seconds: number) => {
    updateSectionTime(sectionIndex, seconds);
  };

  const handleSetPourAmount = (sectionIndex: number, amount: number) => {
    updatePourAmount(sectionIndex, amount);
    
    toast({
      title: "Pour amount updated",
      description: `Updated to ${amount} ml`,
      duration: 2000,
    });
  };

  const currentSection = timerState.sections[timerState.currentSectionIndex];
  const progress = currentSection?.timeInSeconds > 0 
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
    handleRestart,
    handleSetTime,
    handleSetPourAmount,
    updateSections
  };
}
