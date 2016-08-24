import axios from 'axios';

const CONTACT_PATH = '/contacts';

const ContactSource = {
  fetch(params) {
    return axios.get(CONTACT_PATH, { params });
  }
};

export default ContactSource;
