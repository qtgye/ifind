declare interface I_LogEntry {
  date_time: string;
  type: string;
  message: string;
}

declare interface I_ScheduledTaskRouteParam {
  scheduledTask: string;
}

declare interface I_ScheduledTaskContextValues {
  name?: string;
  logs?: Array<I_LogEntry | never>;
  start?: () => void;
  stop?: () => void;
  refetch?: () => void;
}

declare interface I_RawTask {
  id: string;
  name: string;
  status: string;
  frequency: string;
  next_run: string;
  hasModule: boolean;
}

declare interface I_ScheduledTasksProviderValue {
  tasks?: I_RawTask[];
  startTask?: (taskId: string) => any;
  stopTask?: (taskId: string) => any;
  serverTimeUnix?: number|string;
  serverTimeFormatted?: string;
}

declare interface I_ComponentProps {
  children: any;
}

declare interface Task {
  frequency: string;
  id: string;
  name: string;
  next_run: number;
  status: string;
}