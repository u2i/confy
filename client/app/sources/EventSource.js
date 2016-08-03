import axios from 'axios';

const EVENT_PATH = '/events';

const EventSource = {
  fetch(params) {
    return axios.get(EVENT_PATH, { params });
  },

  csrfToken() {
    return document.querySelector('meta[name="csrf-token"]').content
  },

  create(params) {
    return axios({
      method: 'post',
      url: EVENT_PATH,
      data: params,
      headers: {
        'X-CSRF-Token': csrfToken()
      }
    });
  }
};

export default EventSource;
