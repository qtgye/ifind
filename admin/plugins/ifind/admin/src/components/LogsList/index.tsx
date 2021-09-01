import React, { FunctionComponent } from "react";
import PropTypes, { InferProps } from "prop-types";

import LogEntry, { LogEntryPropTypes, LogEntryProps } from "./entry";

export type LOG_TYPE = 'START' | 'STOP' | 'ERROR';

const LogsListPropTypes = {
  status: PropTypes.oneOf([ 'START', 'STOP', 'ERROR' ]),
  logs: PropTypes.arrayOf(PropTypes.shape(LogEntryPropTypes)),
};

export type LogsListProps = InferProps<typeof LogsListPropTypes>;

const LogsList = ({ logs }) => {
  return (
    <div className="logs">
      {logs?.length &&
        logs.map<LogEntryProps>((props = {}) => (
          <LogEntry key={props?.date_time || Date.now()} {...props} />
        ))}
    </div>
  );
};

LogsList.propTypes = LogsListPropTypes;

LogsList.defaultProps = {
  logs: [],
};

export default LogsList;
