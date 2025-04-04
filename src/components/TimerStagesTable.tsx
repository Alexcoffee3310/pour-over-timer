
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
  
  // Calculate total pour amount
  const totalPourAmount = sections.reduce((sum, section) => 
    sum + (section.type === 'pour' ? (section.pourAmount || 0) : 0), 0);
  
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/30 shadow-inner backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-timer-primary/5">
          <TableRow>
            <TableHead className="w-10 text-center font-medium text-timer-text/80">#</TableHead>
            <TableHead className="font-medium text-timer-text/80">Stage</TableHead>
            <TableHead className="text-right font-medium text-timer-text/80">Duration</TableHead>
            <TableHead className="text-right font-medium text-timer-text/80">Pour (ml)</TableHead>
            <TableHead className="w-20 text-center font-medium text-timer-text/80">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section, index) => (
            <TableRow 
              key={index}
              className={currentSectionIndex === index 
                ? 'bg-timer-primary/10 font-medium backdrop-blur-sm shadow-sm' 
                : 'hover:bg-white/30 transition-all duration-300'}
            >
              <TableCell className="text-center font-light">{index + 1}</TableCell>
              <TableCell className="font-light tracking-wide">{section.name}</TableCell>
              <TableCell className="text-right font-mono font-light">{formatTime(section.timeInSeconds)}</TableCell>
              <TableCell className="text-right">
                {section.type === 'pour' ? (
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-light">{section.pourAmount || '-'}</span>
                    {section.pourAmount && <Droplets className="h-3 w-3 text-timer-primary" />}
                  </div>
                ) : '-'}
              </TableCell>
              <TableCell className="text-center">
                {section.type === 'sit' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100/80 text-amber-800 backdrop-blur-sm shadow-sm">
                    Wait
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-timer-primary/10 text-timer-primary backdrop-blur-sm shadow-sm">
                    Pour
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {/* Total row */}
          <TableRow className="font-medium bg-timer-primary/5 border-t border-white/30">
            <TableCell colSpan={2} className="text-right text-timer-text/80">Total</TableCell>
            <TableCell className="text-right font-mono">{formatTime(totalTimeInSeconds)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span>{totalPourAmount || '-'}</span>
                {totalPourAmount > 0 && <Droplets className="h-3 w-3 text-timer-primary" />}
              </div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TimerStagesTable;
