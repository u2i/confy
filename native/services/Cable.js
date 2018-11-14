import ActionCable from 'react-native-actioncable';
import Expo from 'expo';
import ApiService from './ApiService';

const baseUrl = ApiService.url();
const EVENT_CHANNEL = 'EventChannel';
let cable;
let subscription;

export const createSubscription = (callback) => {
  console.log(`cable: ${Expo.Constants.deviceId}`)
  //const url = baseUrl.replace('/api', '/cable');
  const url = 'wss://confy.u2i.com/cable'
  cable = ActionCable.createConsumer(url);
  subscription = cable.subscriptions.create(EVENT_CHANNEL, {
    connected: () => {
      console.log(`cable: connected ${Expo.Constants.deviceId}`);
    },
    received: (data) => {
      console.log(`cable: received ${Expo.Constants.deviceId}`);
      console.log(data);
      callback(data);
    }
  });
}

export const removeSubscription = () => {
  if (cable && subscription) {
    cable.subscriptions.remove(subscription);
  }
}
