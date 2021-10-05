import React, { FunctionComponent } from "react";
import PropTypes, { InferProps } from "prop-types";

export enum LOG_TYPE {
  ERROR = "ERROR",
  INFO = "INFO",
}

export interface LogEntryProps {
  date_time: string
  type: LOG_TYPE
  message: string,
};

const formatLogMessage = (ansiMessage: string = "") =>
  ansiMessage.replace(/(\u001b\[\d+m)/gi, "");
const padType = (type: string = "") =>
  type?.padEnd(5, " ").substr(0, 7).replace(/\s/g, "&nbsp;");

const LogEntry = ({
  date_time,
  type,
  message,
}: LogEntryProps): JSX.Element => {
  return (
    <div className="logs__entry">
      <div className="logs__entry-datetime">{date_time}</div>
      <div
        className="logs__entry-type"
        dangerouslySetInnerHTML={{ __html: padType(type as string) }}
      ></div>
      <div
        className="logs__entry-message"
        dangerouslySetInnerHTML={{
          __html: formatLogMessage(message as string | undefined),
        }}
      ></div>
    </div>
  );
};

export default LogEntry;
