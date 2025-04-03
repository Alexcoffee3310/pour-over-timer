
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { toSeconds } from '@/utils/time-formatter';
import { TimerSection } from '@/types/timer';

interface TimerControlsProps {
  sections: TimerSection[];
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetTime: (sectionIndex: number, seconds: number) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  sections,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSetTime
}) => {
  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [timeInput, setTimeInput] = useState<{ minutes: string, seconds: string }>({
    minutes: '0',
    seconds: '0'
  });

  const handleSetTime = () => {
    const totalSeconds = toSeconds(
      0,
      parseInt(timeInput.minutes) || 0,
      parseInt(timeInput.seconds) || 0
    );
    
    if (totalSeconds > 0) {
      onSetTime(sectionIndex, totalSeconds);
    }
  };

  const handleTimeInputChange = (field: 'minutes' | 'seconds', value: string) => {
    setTimeInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSectionIndex(Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 mb-2">
        <select 
          className="flex-1 h-9 px-3 rounded-md border border-input bg-transparent text-sm"
          value={sectionIndex}
          onChange={handleSectionChange}
        >
          {sections.map((section, index) => (
            <option key={index} value={index}>
              {section.name}
            </option>
          ))}
        </select>
        
        <div className="flex flex-1 gap-1">
          <Input
            type="number"
            min="0"
            max="59"
            value={timeInput.minutes}
            onChange={(e) => handleTimeInputChange('minutes', e.target.value)}
            className="w-full text-center"
            placeholder="Min"
          />
          <Input
            type="number"
            min="0"
            max="59"
            value={timeInput.seconds}
            onChange={(e) => handleTimeInputChange('seconds', e.target.value)}
            className="w-full text-center"
            placeholder="Sec"
          />
        </div>
        
        <Button 
          onClick={handleSetTime} 
          size="sm"
          className="bg-timer-primary hover:bg-timer-primary/90"
        >
          <Clock className="w-4 h-4" />
          <span className="sr-only">Set Time</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        {isRunning ? (
          <Button 
            onClick={onPause} 
            className="bg-amber-500 hover:bg-amber-600 text-white flex-1"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        ) : (
          <Button 
            onClick={onStart} 
            className="bg-timer-primary hover:bg-timer-primary/90 text-white flex-1"
          >
            <Play className="w-5 h-5 mr-2" />
            Start
          </Button>
        )}
        
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="border-timer-muted/50 text-timer-text"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="sr-only md:not-sr-only md:ml-2">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default TimerControls;
