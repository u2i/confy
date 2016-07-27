import axios from 'axios';

const EVENT_PATH = '/events';

const EventSource = {
  fetch() {
    return axios.get(EVENT_PATH);
  }
};

export default EventSource;
