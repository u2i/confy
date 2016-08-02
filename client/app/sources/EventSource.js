import axios from 'axios';

const EVENT_PATH = '/events';

const EventSource = {
  fetch(params) {
    return axios.get(EVENT_PATH, { params });
  }
};

export default EventSource;
