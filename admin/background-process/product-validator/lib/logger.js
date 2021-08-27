const path = require('path');
const { ensureFileSync, appendFileSync } = require('fs-extra');
const moment = require('moment');
const logDir = path.resolve(__dirname, '../logs');

const logTypes = [
  'INFO',
  'ERROR',
];

const logTypeToColor = {
  INFO: 'green',
  ERROR: 'red',
};

// Ensure we only use valid log type
const isValidLogType = logType => (new RegExp(logTypes.join('|'))).test(logType);

// Writes a log entry into the log file
const writeLogEntry = ( logEntry ) => {
  const dateTime = moment.utc().format('YYYY-MM-DD');
  const logFile = path.resolve(logDir, dateTime + '.log');

  // Ensure log file is present
  ensureFileSync(logFile);

  // Write to file
  appendFileSync(logFile, logEntry);
}

/**
 * Logs a message into the log files and into the console
 * Message formatting follows the console formatting
 * @param {String} logMessage CLI message
 * @param {String} type - one of logTypes
 */
module.exports = (logMessage = '', type) => {
  const logType = isValidLogType(type) ? type : logTypes[0];
  const colorFn = logTypeToColor[logType];
  const dateTime = moment.utc().format('YYYY-MM-DD HH:MM:SS');
  const logEntry = [
    dateTime.bold,
    logType.padEnd(10).substr(0, 5)[colorFn], // Ensure log type string will have the same spacings
    logMessage
  ].join(' | ');

  // Add to logs
  writeLogEntry(logEntry + '\n');

  // Log to console
  console.log(logMessage);
}
