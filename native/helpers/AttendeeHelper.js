import map from 'lodash/map';
import upperFirst from 'lodash/upperFirst';

export const attendeeName = (guest) => {
  if (guest.display_name) {
    return guest.display_name;
  }
  else if (guest.email.match('@u2i.com')) {
    const name = guest.email.replace(/@.*$/, '');

    return map(name.split('.'), upperFirst).join(' ');
  }
  else {
    return guest.email;
  }
}

export const attendeeClass = (guest) => {
  const status = guest.response_status;

  if (status === 'needsAction') {
    return 'gray';
  }
  else if (status === 'accepted') {
    return 'green';
  }
  else {
    return 'red';
  }
}

export const attendeeIcon = (guest) => {
  const status = guest.response_status;

  if (status === 'needsAction') {
    return 'help';
  }
  else if (status === 'accepted') {
    return 'check-circle';
  }
  else {
    return 'cancel';
  }
}
