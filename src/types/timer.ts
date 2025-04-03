
export interface TimerSection {
  name: string;
  timeInSeconds: number;
  type?: 'pour' | 'sit';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  sections: TimerSection[];
  isCustom?: boolean;
}

export interface TimerState {
  sections: TimerSection[];
  currentSectionIndex: number;
  isRunning: boolean;
  isCompleted: boolean;
  totalTimeInSeconds?: number;
}
