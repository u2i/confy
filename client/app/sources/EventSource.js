import axios from 'axios';

const EVENT_PATH = '/events';

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
  fetch(params) {
    return axios.get(EVENT_PATH, { params });
  },
  remove(id) {
    axios({
      method: 'DELETE',
      url: `${EVENT_PATH}/${id}`,
    }).then(() => {}).catch(() => {
      alert('Server error');
    });
  },
  create(params) {
    return axios({
      method: 'post',
      url: EVENT_PATH,
      data: params
    });
  }
};

export default EventSource;
