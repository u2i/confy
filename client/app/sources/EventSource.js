import axios from 'axios';

const EVENT_PATH = '/events';

const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

const EventSource = {
  fetch(params) {
    return axios.get(EVENT_PATH, { params });
  },

  create(params) {
    return axios({
      method: 'post',
      url: EVENT_PATH,
      data: params,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
  }
};

export default EventSource;
