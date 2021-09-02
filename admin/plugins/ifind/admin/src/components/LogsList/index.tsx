import React, { FunctionComponent } from "react";
import PropTypes, { InferProps } from "prop-types";

import LogEntry, { LogEntryPropTypes, LogEntryProps } from "./entry";

import './styles.scss';

export type LOG_TYPE = "START" | "STOP" | "ERROR";

const LogsListPropTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape(LogEntryPropTypes)),
};

export type LogsListProps = InferProps<typeof LogsListPropTypes>;

const LogsList: FunctionComponent<LogsListProps> = ({ logs }) => {
  return (
    <div className="logs">
      <h3 className="logs__heading">Logs</h3>
      <div className="logs__entries">
        {logs?.length &&
          logs.map((props: LogEntryProps = {}) => (
            <LogEntry key={props?.date_time || Date.now()} {...props} />
          ))}
      </div>
    </div>
  );
};

LogsList.propTypes = LogsListPropTypes;

LogsList.defaultProps = {
  logs: [],
};

export default LogsList;
