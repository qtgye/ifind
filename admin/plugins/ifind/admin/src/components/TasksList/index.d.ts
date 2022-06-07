declare interface TasksListProps {
  tasks: I_RawTask[];
  limit?: number|string;

  onTaskAction?: (action: string, taskID: string) => any;
}