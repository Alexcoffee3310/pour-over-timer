
import React from 'react';
import { TimerSection } from '@/types/timer';
import { formatTime } from '@/utils/time-formatter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Droplets } from 'lucide-react';

interface TimerStagesTableProps {
  sections: TimerSection[];
  currentSectionIndex: number;
  isRunning: boolean;
}

const TimerStagesTable: React.FC<TimerStagesTableProps> = ({
  sections,
  currentSectionIndex,
  isRunning,
}) => {
  // Calculate the total time of all sections
  const totalTimeInSeconds = sections.reduce((sum, section) => sum + section.timeInSeconds, 0);
  
  return (
    <div className="w-full overflow-hidden rounded-md shadow-sm border border-timer-secondary/20 rustic-glass">
      <Table>
        <TableHeader className="bg-timer-primary/10 h-[70%]"> {/* Flattened height by 30% */}
          <TableRow>
            <TableHead className="w-10 text-center font-medium text-timer-text/90 py-0.5 text-xs">#</TableHead>
            <TableHead className="font-medium text-timer-text/90 py-0.5 text-xs">Stage</TableHead>
            <TableHead className="text-right font-medium text-timer-text/90 py-0.5 text-xs">Duration</TableHead>
            <TableHead className="text-right font-medium text-timer-text/90 py-0.5 text-xs">Pour to (ml)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section, index) => (
            <TableRow 
              key={index}
              className={currentSectionIndex === index 
                ? 'bg-timer-primary/20 font-medium backdrop-blur-sm border-l-2 border-l-timer-primary' 
                : 'hover:bg-white/10 transition-all duration-300'}
            >
              <TableCell className="text-center font-light py-0.5 text-xs">{index + 1}</TableCell>
              <TableCell className="font-light tracking-wide py-0.5 text-xs">{section.name}</TableCell>
              <TableCell className="text-right font-mono font-light py-0.5 text-xs">{formatTime(section.timeInSeconds)}</TableCell>
              <TableCell className="text-right py-0.5 text-xs">
                {section.type === 'pour' ? (
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-light">{section.pourAmount || '-'}</span>
                    {section.pourAmount && <Droplets className="h-3 w-3 text-timer-primary" />}
                  </div>
                ) : '-'}
              </TableCell>
            </TableRow>
          ))}
          
          {/* Total row - only for duration */}
          <TableRow className="font-medium bg-timer-primary/10 border-t border-timer-secondary/20">
            <TableCell colSpan={2} className="text-right text-timer-text/80 py-0.5 text-xs">Total</TableCell>
            <TableCell className="text-right font-mono py-0.5 text-xs">{formatTime(totalTimeInSeconds)}</TableCell>
            <TableCell className="text-right py-0.5 text-xs">-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TimerStagesTable;
