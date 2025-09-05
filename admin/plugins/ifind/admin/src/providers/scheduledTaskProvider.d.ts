declare interface ScheduledTaskContextData {
  task?: Task;
  serverTimeFormatted?: string;
  refetch?: () => void;
  updateTask: (taskID: Task["id"], newData: Partial<Task>) => void;
  updatePriority: (taskID: Task["id"], newPriority: number) => void;
}

declare interface ScheduledTaskRouteParams {
  taskID: string;
}
