declare interface QueueProps {
  items: I_QueueItem[];
  onQueueItemAction?: (action: string, taskID: string) => any;
}

declare interface QueueItemActionsProps extends I_QueueItem {
  onAction: (actionType: "start" | "stop", id: string) => void;
}
