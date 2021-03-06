import moment from 'moment';

export const DATE_PARAM_FORMAT = 'YYYY-MM-DD';

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';

export const TIME_DISPLAY_FORMAT = 'HH:mm';

export const ONE_MINUTE = 1000 * 60;

export function addDateAndTime(date, time) {
  const [hours, minutes, seconds] = [time.hours(), time.minutes(), time.seconds()];
  return date
    .clone()
    .hours(hours)
    .minutes(minutes)
    .seconds(seconds);
}

export function timestamp(date, time) {
  if (time) {
    return addDateAndTime(date, time).unix();
  }
  return date.unix();
}

export function formatDate(date, format = 'ddd M/D') {
  if (moment.isMoment(date)) {
    return date.format(format);
  }
  return moment(date).format(format);
}

export function formatTime(time, format = 'H:mm') {
  return formatDate(time, format);
}

export function weekDays(date, weekLength = 5) {
  const start = date.startOf('isoWeek');
  return [...new Array(weekLength).keys()]
    .map(i => start
      .clone()
      .add(i, 'days'));
}

export function addTime(date, number, unit) {
  return date.clone().add(number, unit);
}

export function subtractTime(date, number, unit) {
  return date.clone().subtract(number, unit);
}

export function nextWeek(date) {
  return addTime(date, 1, 'week');
}

export function previousWeek(date) {
  return subtractTime(date, 1, 'week');
}

export function dateParam(date) {
  return formatDate(date, DATE_PARAM_FORMAT);
}

export function isToday(day) {
  return moment(day).isSame(moment(), 'day');
}

export function minutesFromMidnight(start = moment()) {
  return start.diff(moment().startOf('day'), 'minutes');
}

export function eventTimeString(event, timeFormat) {
  const startTimeStr = formatTime(event.start.date_time, timeFormat);
  const endTimeStr = formatTime(event.end.date_time, timeFormat);
  return `${startTimeStr} - ${endTimeStr}`;
}

export function formatDuration(duration, format) {
  return moment([1, 0, 1, 0, 0, 0])
    .add(duration)
    .subtract(1, 'year')
    .subtract(1, 'month')
    .subtract(1, 'day')
    .format(format);
}

export function sameDay(date, other) {
  return moment(date).day() === moment(other).day();
}

export function roundedTime(date, granularity) {
  const diff = date.unix() % granularity;
  if (diff > 60) {
    return date.clone().add(granularity - diff, 'seconds');
  }
  return date.clone().subtract(diff, 'seconds');
}


function pluralize(string, number, includeNumber) {
  const word = (number === 1 ? string : `${string}s`);
  return includeNumber ? `${number} ${word}` : word;
}

export function durationFromNow(time) {
  const now = moment();
  return moment.duration(time.diff(now));
}

export function humanizeTime(duration) {
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

export function isFullNonZeroMinute(time, precision) {
  return time % (60 * 1000) <= precision && time >= precision;
}
