
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { toSeconds } from '@/utils/time-formatter';
import { TimerSection } from '@/types/timer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState<string>("0");
  const [timeInputs, setTimeInputs] = useState<{ [key: number]: { hours: string; minutes: string; seconds: string } }>(
    sections.reduce((acc, _, index) => {
      acc[index] = { hours: '0', minutes: '0', seconds: '0' };
      return acc;
    }, {} as { [key: number]: { hours: string; minutes: string; seconds: string } })
  );

  const handleSetTime = (sectionIndex: number) => {
    const input = timeInputs[sectionIndex];
    const totalSeconds = toSeconds(
      parseInt(input.hours) || 0,
      parseInt(input.minutes) || 0,
      parseInt(input.seconds) || 0
    );
    
    if (totalSeconds > 0) {
      onSetTime(sectionIndex, totalSeconds);
    }
  };

  const handleTimeInputChange = (sectionIndex: number, field: 'hours' | 'minutes' | 'seconds', value: string) => {
    setTimeInputs(prev => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        [field]: value
      }
    }));
  };

  // Group tabs to show at most 3 per row for better UI
  const renderTabsList = () => {
    const numberOfSections = sections.length;
    
    if (numberOfSections <= 3) {
      // For 1-3 sections, use a single row
      return (
        <TabsList className={`grid grid-cols-${numberOfSections} mb-2 w-full`}>
          {sections.map((section, index) => (
            <TabsTrigger 
              key={index} 
              value={index.toString()} 
              className="text-xs sm:text-sm flex items-center"
            >
              {section.name}
              {section.type === 'sit' && (
                <span className="ml-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      );
    } else {
      // For more than 3 sections, create a scrollable row
      return (
        <div className="overflow-x-auto mb-2 pb-2">
          <TabsList className="inline-flex min-w-full">
            {sections.map((section, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()} 
                className="text-xs sm:text-sm whitespace-nowrap flex items-center"
              >
                {section.name}
                {section.type === 'sit' && (
                  <span className="ml-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {renderTabsList()}
        
        {sections.map((section, index) => (
          <TabsContent key={index} value={index.toString()} className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor={`hours-${index}`} className="text-xs text-timer-text/70">Hours</label>
                <Input
                  id={`hours-${index}`}
                  type="number"
                  min="0"
                  max="99"
                  value={timeInputs[index].hours}
                  onChange={(e) => handleTimeInputChange(index, 'hours', e.target.value)}
                  className="w-full text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`minutes-${index}`} className="text-xs text-timer-text/70">Minutes</label>
                <Input
                  id={`minutes-${index}`}
                  type="number"
                  min="0"
                  max="59"
                  value={timeInputs[index].minutes}
                  onChange={(e) => handleTimeInputChange(index, 'minutes', e.target.value)}
                  className="w-full text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`seconds-${index}`} className="text-xs text-timer-text/70">Seconds</label>
                <Input
                  id={`seconds-${index}`}
                  type="number"
                  min="0"
                  max="59"
                  value={timeInputs[index].seconds}
                  onChange={(e) => handleTimeInputChange(index, 'seconds', e.target.value)}
                  className="w-full text-center"
                />
              </div>
              <Button 
                onClick={() => handleSetTime(index)} 
                className="mt-6 bg-timer-primary hover:bg-timer-primary/90"
              >
                <Clock className="w-4 h-4 mr-2" />
                Set
              </Button>
            </div>

            <div className="text-sm text-timer-text/70">
              {section.type === 'sit' ? (
                <p>This is a waiting period after the {sections[index-1]?.name || 'previous step'}.</p>
              ) : (
                <p>Set the time for the {section.name} stage.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
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
