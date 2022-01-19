const timeToMsMap = {
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

/**
 * Formats a given milliseconds amount into readable time amounts (days, hours, minutes, seconds)
 * e.g., 2 hours, 3 minutes, 55 seconds
 * @param {Int} milliseconds
 */
module.exports = (milliseconds = 0) => {
  const timeToMsValues = Object.values(timeToMsMap);

  const timeAmount = timeToMsValues
    .reduce(
      ([timeAmountSegments, remainingMs], timeMs) => {
        const segmentCount = Math.floor(remainingMs / timeMs);
        timeAmountSegments.push(
          `${segmentCount < 10 ? 0 : ''}${segmentCount}`
        );
        remainingMs -= segmentCount * timeMs;

        return [timeAmountSegments, remainingMs];
      },
      [[], milliseconds]
    )[0]
    .join(":");

  return timeAmount;
};
