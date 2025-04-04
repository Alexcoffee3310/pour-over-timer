
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
    
    // Update pour amount input when changing section
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
      
      {isPourSection && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-40 text-sm text-gray-500">Pour amount:</div>
          <Input
            type="number"
            min="0"
            value={pourAmountInput}
            onChange={(e) => setPourAmountInput(e.target.value)}
            className="w-full text-center"
            placeholder="ml"
            disabled={!isPourSection}
          />
          
          <Button 
            onClick={handleSetPourAmount} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!isPourSection}
          >
            <Droplets className="w-4 h-4" />
            <span className="sr-only">Set Amount</span>
          </Button>
        </div>
      )}
      
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
