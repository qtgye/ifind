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
 * @param {Boolean} expressive - Whether to use time units ('hour', 'min', etc.)
 */
module.exports = (milliseconds = 0, expressive = false) => {
  const timeToMsEntries = Object.entries(timeToMsMap);

  const timeAmount = timeToMsEntries
    .reduce(
      ([timeAmountSegments, remainingMs], [timeUnit, timeMs]) => {
        const segmentCount = Math.floor(remainingMs / timeMs);

        if (expressive) {
          if (segmentCount) {
            timeAmountSegments.push(
              `${segmentCount} ${timeUnit}${segmentCount > 1 ? "s" : ""}`
            );
          }
        } else {
          timeAmountSegments.push(
            `${segmentCount < 10 ? 0 : ""}${segmentCount}`
          );
        }

        remainingMs -= segmentCount * timeMs;

        return [timeAmountSegments, remainingMs];
      },
      [[], milliseconds]
    )[0]
    .join(":");

  return timeAmount;
};
