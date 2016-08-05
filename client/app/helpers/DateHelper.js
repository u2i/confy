import moment from 'moment';

export const DATE_PARAM_FORMAT = 'YYYY-MM-DD';

export function addDateAndTime(date, time) {
  time = moment(time);
  const [hours, minutes, seconds] = [time.hours(), time.minutes(), time.seconds()];
  return moment(date)
    .hours(hours)
    .minutes(minutes)
    .seconds(seconds);
}

export function timestamp(date, time) {
  if (time) {
    return addDateAndTime(date, time).unix();
  }
  return moment(date).unix();
}

export function formatDate(date, format = 'ddd M/D') {
  return moment(date).format(format);
}

export function formatTime(time, format = 'H:mm') {
  return formatDate(time, format);
}

export function weekDays(date, weekLength = 5) {
  const start = moment(date).startOf('isoWeek');
  return [...new Array(weekLength).keys()]
    .map(i => start
      .clone()
      .add(i, 'days')
      .toDate());
}
