import axios from 'axios';

const EVENT_PATH = '/events';

const EventSource = {
  fetch(params) {
    return axios.get(EVENT_PATH, { params });
  },
  
  remove(id) {
    const token = document.querySelector('meta[name="csrf-token"]').content;
    console.log(`${EVENT_PATH}/${id}`);
    axios({
      method: 'DELETE',
      url: `${EVENT_PATH}/${id}`,
      headers: {
        'X-CSRF-Token': token
      }
    }).then(() => {}).catch(() => {
      alert('Server error');
    });
  }
};

export default EventSource;
