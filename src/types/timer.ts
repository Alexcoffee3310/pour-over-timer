
export interface TimerSection {
  name: string;
  timeInSeconds: number;
}

export interface TimerState {
  sections: TimerSection[];
  currentSectionIndex: number;
  isRunning: boolean;
  isCompleted: boolean;
}
