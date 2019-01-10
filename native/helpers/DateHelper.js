import moment from 'moment';

export const ONE_MINUTE = 1000 * 60;

export const pluralize = (string, number, includeNumber) => {
  const word = (number === 1 ? string : `${string}s`);
  return includeNumber ? `${number} ${word}` : word;
}

export const durationFromNow = (time) => {
  const now = moment();
  return moment.duration(time.diff(now));
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
  return time % (ONE_MINUTE) <= precision && time >= precision;
}

export const formatDuration = (duration, format) => {
  return moment([1, 0, 1, 0, 0, 0])
    .add(duration)
    .subtract(1, 'year')
    .subtract(1, 'month')
    .subtract(1, 'day')
    .format(format);
}
