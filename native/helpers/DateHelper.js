import moment from 'moment';

const pluralize =(string, number, includeNumber) => {
  const word = (number === 1 ? string : `${string}s`);
  return includeNumber ? `${number} ${word}` : word;
}

export const humanizeTime = (duration) => {
  if (duration.hours() > 0) {
    if (duration.minutes() > 0) {
      return `${pluralize('hour', duration.hours(), true)} and ${pluralize('minute', duration.minutes(), true)}`;
    }
    return pluralize('hour', duration.hours(), true);
  } else if (duration.minutes() > 0) {
    return pluralize('minute', duration.minutes(), true);
  }
  return pluralize('second', Math.max(duration.seconds(), 0), true);
}

export const isFullNonZeroMinute = (time, precision) => {
  return time % (60 * 1000) <= precision && time >= precision;
}
