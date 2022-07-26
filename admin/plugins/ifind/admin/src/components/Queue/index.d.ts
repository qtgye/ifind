declare interface QueueProps {
  items: I_QueueItem[];
  onQueueItemAction?: (action: string, taskID: string) => any;
}