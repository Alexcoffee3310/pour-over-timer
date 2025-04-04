
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
    <div className="w-full overflow-hidden rounded-md border mb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Pour (ml)</TableHead>
            <TableHead className="w-20 text-center">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section, index) => (
            <TableRow 
              key={index}
              className={currentSectionIndex === index ? 'bg-timer-primary/10 font-medium' : ''}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{section.name}</TableCell>
              <TableCell className="text-right font-mono">{formatTime(section.timeInSeconds)}</TableCell>
              <TableCell className="text-right">
                {section.type === 'pour' ? (
                  <div className="flex items-center justify-end gap-1">
                    <span>{section.pourAmount || '-'}</span>
                    {section.pourAmount && <Droplets className="h-3 w-3 text-blue-600" />}
                  </div>
                ) : '-'}
              </TableCell>
              <TableCell className="text-center">
                {section.type === 'sit' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
                    Wait
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                    Pour
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {/* Total row */}
          <TableRow className="font-medium bg-gray-50">
            <TableCell colSpan={2} className="text-right">Total</TableCell>
            <TableCell className="text-right font-mono">{formatTime(totalTimeInSeconds)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span>{totalPourAmount || '-'}</span>
                {totalPourAmount > 0 && <Droplets className="h-3 w-3 text-blue-600" />}
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
