import React, { FunctionComponent } from 'react';
import PropTypes, { InferProps } from 'prop-types';

export enum LOG_TYPE {
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export const LogEntryPropTypes = {
  date_time: PropTypes.string,
  type: PropTypes.oneOf<LOG_TYPE>([ LOG_TYPE.ERROR, LOG_TYPE.INFO ]),
  message: PropTypes.string,
};

export const LogEntryDefaultProps = {
  date_time: '',
  type: 'INFO',
  message: '',
};

export type LogEntryProps = InferProps<typeof LogEntryPropTypes>;

const LogEntry: FunctionComponent =  ({ date_time, type, message }: LogEntryProps ) => {
  return (
    <div>
      {date_time}
      {type}
      {message}
    </div>
  );
}

LogEntry.propTypes = LogEntryPropTypes;

LogEntry.defaultProps = LogEntryDefaultProps;

export default LogEntry;