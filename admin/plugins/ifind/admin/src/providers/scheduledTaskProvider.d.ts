declare interface ScheduledTaskContextData {
  task?: Task;
  refetch?: () => void;
  updateTask: (taskID: Task["id"], enwData: Partial<Task>) => void;
}

declare interface ScheduledTaskRouteParams {
  taskID: string;
}
