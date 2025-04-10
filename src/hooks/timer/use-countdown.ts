
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { TimerSection } from '@/types/timer';

export function useCountdown(
  sections: TimerSection[],
  currentSectionIndex: number,
  isRunning: boolean,
  onSectionComplete: () => void,
  onTimerComplete: () => void
) {
  const [timeRemaining, setTimeRemaining] = useState(sections[currentSectionIndex]?.timeInSeconds || 0);
  const { toast } = useToast();
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Reset timeRemaining when currentSectionIndex changes
  useEffect(() => {
    setTimeRemaining(sections[currentSectionIndex]?.timeInSeconds || 0);
  }, [currentSectionIndex, sections]);
  
  // Handle countdown logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            const nextSectionIndex = currentSectionIndex + 1;
            
            if (nextSectionIndex < sections.length) {
              onSectionComplete();
              
              if (audioRef.current) {
                audioRef.current.play().catch(error => 
                  console.error("Audio playback failed:", error)
                );
              }
              
              const currentSection = sections[currentSectionIndex];
              const nextSection = sections[nextSectionIndex];
              toast({
                title: `${currentSection.name} completed!`,
                description: `Moving to ${nextSection.name}`,
                duration: 3000,
              });
              
              return sections[nextSectionIndex].timeInSeconds;
            } else {
              clearInterval(intervalRef.current!);
              onTimerComplete();
              
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
  }, [isRunning, currentSectionIndex, sections, onSectionComplete, onTimerComplete, toast]);
  
  return { timeRemaining };
}
