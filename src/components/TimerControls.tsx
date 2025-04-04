
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Pause, RotateCcw, Droplets } from 'lucide-react';
import { toSeconds } from '@/utils/time-formatter';
import { TimerSection } from '@/types/timer';

interface TimerControlsProps {
  sections: TimerSection[];
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetTime: (sectionIndex: number, seconds: number) => void;
  onSetPourAmount: (sectionIndex: number, amount: number) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  sections,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSetTime,
  onSetPourAmount
}) => {
  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [timeInput, setTimeInput] = useState<{ minutes: string, seconds: string }>({
    minutes: '0',
    seconds: '0'
  });
  const [pourAmountInput, setPourAmountInput] = useState<string>('0');

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

  const handleSetPourAmount = () => {
    const amount = parseInt(pourAmountInput) || 0;
    
    if (amount >= 0) {
      onSetPourAmount(sectionIndex, amount);
    }
  };

  const handleTimeInputChange = (field: 'minutes' | 'seconds', value: string) => {
    setTimeInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.value);
    setSectionIndex(index);
    
    const section = sections[index];
    if (section.type === 'pour') {
      setPourAmountInput((section.pourAmount || 0).toString());
    } else {
      setPourAmountInput('0');
    }
  };

  const currentSection = sections[sectionIndex];
  const isPourSection = currentSection?.type === 'pour';

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 mb-1">
        <select 
          className="flex-1 h-8 px-3 rounded-md border border-white/40 bg-white/30 backdrop-blur-sm text-sm shadow-sm"
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
            className="w-full text-center bg-white/40 border-white/40 h-8"
            placeholder="Min"
          />
          <Input
            type="number"
            min="0"
            max="59"
            value={timeInput.seconds}
            onChange={(e) => handleTimeInputChange('seconds', e.target.value)}
            className="w-full text-center bg-white/40 border-white/40 h-8"
            placeholder="Sec"
          />
        </div>
        
        <Button 
          onClick={handleSetTime} 
          size="sm"
          className="bg-timer-primary hover:bg-timer-primary/90 shadow-md h-8"
        >
          <Clock className="w-4 h-4" />
          <span className="sr-only">Set Time</span>
        </Button>
      </div>
      
      {isPourSection && (
        <div className="flex items-center gap-2 mb-1">
          <div className="w-40 text-sm text-timer-text/80 font-medium">Pour amount (ml):</div>
          <Input
            type="number"
            min="0"
            value={pourAmountInput}
            onChange={(e) => setPourAmountInput(e.target.value)}
            className="w-1/2 text-center bg-white/40 border-white/40 h-8"
            placeholder="ml"
            disabled={!isPourSection}
          />
          
          <Button 
            onClick={handleSetPourAmount} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 shadow-md h-8"
            disabled={!isPourSection}
          >
            <Droplets className="w-4 h-4" />
            <span className="sr-only">Set Amount</span>
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-4 mt-1">
        {isRunning ? (
          <Button 
            onClick={onPause} 
            className="bg-amber-500 hover:bg-amber-600 text-white flex-1 h-10 shadow-md"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        ) : (
          <Button 
            onClick={onStart} 
            className="bg-timer-primary hover:bg-timer-primary/90 text-white flex-1 h-10 shadow-md"
          >
            <Play className="w-5 h-5 mr-2" />
            Start
          </Button>
        )}
        
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="border-timer-muted/50 text-timer-text bg-white/20 backdrop-blur-sm h-10 shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="sr-only md:not-sr-only md:ml-2">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default TimerControls;
