
export interface TimerSection {
  name: string;
  timeInSeconds: number;
  type?: 'pour' | 'sit';
}

export interface TimerState {
  sections: TimerSection[];
  currentSectionIndex: number;
  isRunning: boolean;
  isCompleted: boolean;
  totalTimeInSeconds?: number;
}
