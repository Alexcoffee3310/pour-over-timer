
import React from 'react';
import { TimerSection } from '@/types/timer';
import { formatTime } from '@/utils/time-formatter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  return (
    <div className="w-full overflow-hidden rounded-md border mb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Duration</TableHead>
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
        </TableBody>
      </Table>
    </div>
  );
};

export default TimerStagesTable;
