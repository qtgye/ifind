import React, { FunctionComponent } from "react";
import PropTypes, { InferProps } from "prop-types";

export enum LOG_TYPE {
  ERROR = "ERROR",
  INFO = "INFO",
}

export const LogEntryPropTypes = {
  date_time: PropTypes.string,
  type: PropTypes.oneOf<LOG_TYPE>([LOG_TYPE.ERROR, LOG_TYPE.INFO]),
  message: PropTypes.string,
};

export const LogEntryDefaultProps = {
  date_time: "",
  type: "INFO",
  message: "",
};

export type LogEntryProps = InferProps<typeof LogEntryPropTypes>;

const formatLogMessage = (ansiMessage: string = "") =>
  ansiMessage.replace(/(\u001b\[\d+m)/gi, "");
const padType = (type: string = "") =>
  type?.padEnd(5, " ").substr(0, 7).replace(/\s/g, "&nbsp;");

const LogEntry: FunctionComponent = ({
  date_time,
  type,
  message,
}: LogEntryProps) => {
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

LogEntry.propTypes = LogEntryPropTypes;

LogEntry.defaultProps = LogEntryDefaultProps;

export default LogEntry;
