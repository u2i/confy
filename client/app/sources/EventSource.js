import axios from 'axios';

const CONFERENCE_ROOMS_PATH = '/conference_rooms';
const EVENTS_PATH = '/events';

const eventsPath = (roomId) => roomId ? `${CONFERENCE_ROOMS_PATH}/${roomId}/events` : EVENTS_PATH;
const eventPath = (roomId, eventId) => `${eventsPath(roomId)}/${eventId}`;
const confirmPath = (roomId, eventId) => `${eventPath(roomId, eventId)}/confirm`;
const finishPath = (roomId, eventId) => `${eventPath(roomId, eventId)}/finish`;

const getCSRFToken = (config) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  if (config.headers) {
    config.headers['X-CSRF-Token'] = token;
  } else {
    config.headers = { 'X-CSRF-Token': token };
  }
  return config;
};

axios.interceptors.request.use(getCSRFToken, (error) => Promise.reject(error));

const EventSource = {
  fetch(params, conferenceRoomId) {
    return axios.get(eventsPath(conferenceRoomId), { params });
  },
  remove(id) {
    return axios.delete(`${EVENTS_PATH}/${id}`);
  },
  create(params) {
    return axios.post(EVENTS_PATH, { event: params });
  },
  confirm(conferenceRoomId, eventId) {
    return axios.post(confirmPath(conferenceRoomId, eventId));
  },
  finish(conferenceRoomId, eventId) {
    return axios.post(finishPath(conferenceRoomId, eventId));
  }
};

export default EventSource;
