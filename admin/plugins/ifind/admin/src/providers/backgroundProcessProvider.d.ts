declare interface I_LogEntry {
  date_time: string;
  type: string;
  message: string;
}
declare interface I_BackgroundProcessRouteParam {
  backgroundProcess: string;
}
declare interface I_BackgroundProcessProviderValues {
  name?: string;
  logs?: Array<I_LogEntry | never>;
  start?: () => void;
  stop?: () => void;
  refetch?: () => void;
}