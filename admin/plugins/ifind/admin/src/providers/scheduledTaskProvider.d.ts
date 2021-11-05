declare interface ScheduledTaskContextData {
  task?: Task;
  refetch?: () => void;
}

declare interface ScheduledTaskRouteParams {
  taskID: string;
}
