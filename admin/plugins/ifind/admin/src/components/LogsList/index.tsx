import React, { useEffect, useState } from "react";
import LogEntry, { LogEntryProps } from "./entry";

import './styles.scss';

export type LogsListProps = {
  logs: LogEntryProps[]
};

interface I_LogsListMap {
  [key: string]: LogEntryProps
}

const LogsList = ({ logs }: LogsListProps) => {
  const [ logsList, setLogsList ] = useState<LogEntryProps[]>([]);

  useEffect(() => {
    // Ensure logs are sorted in ascending datetime
    setLogsList([...logs.reverse()]);
  }, [ logs ]);

  return (
    <div className="logs">
      <h3 className="logs__heading">Logs</h3>
      <div className="logs__entries">
        {logsList?.length &&
          logsList.map((props: LogEntryProps) => (
            <LogEntry key={props.date_time + props.message} {...props} />
          ))}
      </div>
    </div>
  );
};

export default LogsList;
