import moment from 'moment'

export function addDateAndTime(dateStr, timeStr) {
  let time = new Date(timeStr);
  let date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDay(), time.getHours(), time.getMinutes());
}

export function timestamp(date, time) {
  if (time) {
    return addDateAndTime(date, time).getTime() / 1000;
  } 
  return new Date(date).getTime() / 1000;
}

export function formatDate(date, format='ddd M/D') {
  return moment(date).format(format);
}

export function formatTime(time, format='H:mm') {
  return formatDate(time, format);
}
