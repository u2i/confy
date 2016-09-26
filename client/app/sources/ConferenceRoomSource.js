import axios from 'axios';

const ConferenceRoomSource = {
  fetch() {
    return axios.get('/conference_rooms');
  }
};

export default ConferenceRoomSource;
