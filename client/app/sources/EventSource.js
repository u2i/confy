import axios from 'axios';

const CONFERENCE_ROOM_PATH = '/conference_rooms';
const EVENT_PATH = '/events';

const eventPath = (roomId) => roomId ? `${CONFERENCE_ROOM_PATH}/${roomId}/events` : EVENT_PATH;

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
    return axios.get(eventPath(conferenceRoomId), { params });
  },
  remove(id) {
    return axios.delete(`${EVENT_PATH}/${id}`);
  },
  create(params) {
    return axios.post(EVENT_PATH, { event: params });
  },
  confirm(conferenceRoomId, eventId) {
    return axios.post(`${eventPath(conferenceRoomId)}/${eventId}/confirm`);
  },
  finish(conferenceRoomId, eventId) {
    return axios.post(`${eventPath(conferenceRoomId)}/${eventId}/finish`);
  }
};

export default EventSource;
