import React, { useCallback } from "react";
import Convert from "ansi-to-html";

const convert = new Convert();

export interface LogEntryProps extends I_LogEntry {}

const LogEntry = ({ date_time, type, message }: LogEntryProps): JSX.Element => {
  const ansiToHtml = useCallback((ansiText) => convert.toHtml(ansiText), []);

  return (
    <div className="logs__entry">
      <div
        className="logs__entry-datetime"
        dangerouslySetInnerHTML={{ __html: ansiToHtml(date_time) }}
      ></div>
      <div
        className="logs__entry-type"
        dangerouslySetInnerHTML={{ __html: ansiToHtml(type.replace(/\s/g, '&nbsp;')) }}
      ></div>
      <div
        className="logs__entry-message"
        dangerouslySetInnerHTML={{ __html: ansiToHtml(message) }}
      ></div>
    </div>
  );
};

export default LogEntry;
