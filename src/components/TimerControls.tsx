
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { toSeconds } from '@/utils/time-formatter';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetTime: (seconds: number) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSetTime
}) => {
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [seconds, setSeconds] = useState<string>('0');

  const handleSetTime = () => {
    const totalSeconds = toSeconds(
      parseInt(hours) || 0,
      parseInt(minutes) || 0,
      parseInt(seconds) || 0
    );
    
    if (totalSeconds > 0) {
      onSetTime(totalSeconds);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="hours" className="text-xs text-timer-text/70">Hours</label>
          <Input
            id="hours"
            type="number"
            min="0"
            max="99"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full text-center"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="minutes" className="text-xs text-timer-text/70">Minutes</label>
          <Input
            id="minutes"
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full text-center"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="seconds" className="text-xs text-timer-text/70">Seconds</label>
          <Input
            id="seconds"
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-full text-center"
          />
        </div>
        <Button onClick={handleSetTime} className="mt-6 bg-timer-primary hover:bg-timer-primary/90">
          <Clock className="w-4 h-4 mr-2" />
          Set
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-2">
        {isRunning ? (
          <Button 
            onClick={onPause} 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            size="lg"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        ) : (
          <Button 
            onClick={onStart} 
            className="bg-timer-primary hover:bg-timer-primary/90 text-white"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start
          </Button>
        )}
        
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="border-timer-muted/50 text-timer-text"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TimerControls;
