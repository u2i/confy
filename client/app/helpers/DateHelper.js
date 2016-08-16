import moment from 'moment';

export const DATE_PARAM_FORMAT = 'YYYY-MM-DD';

export function addDateAndTime(date, time) {
  const [hours, minutes, seconds] = [time.hours(), time.minutes(), time.seconds()];
  return date
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

export function nextWeek(date) {
  return date.clone().add(1, 'week');
}

export function previousWeek(date) {
  return date.clone().subtract(1, 'week');
}

export function dateParam(date) {
  return formatDate(date, DATE_PARAM_FORMAT);
}
