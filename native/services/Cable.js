import ActionCable from 'react-native-actioncable';
import Expo from 'expo';
import ApiService from './ApiService';

const baseUrl = ApiService.url();
const EVENT_CHANNEL = 'EventChannel';
const CALL_CHANNEL = 'CallChannel';

let cable;
let callSubscription;
let eventSubscription;

export const createSubscription = (callback) => {
  const url = baseUrl.replace('/api', '/cable');
  cable = ActionCable.createConsumer(url);

  callSubscription = cable.subscriptions.create(CALL_CHANNEL, {
    connected: () => {
      // console.log(`cable: call connected ${Expo.Constants.deviceId}`);
    },
    received: (data) => {
      // console.log(`cable: call received ${Expo.Constants.deviceId}`);
      // console.log(data);
      //callback(data);
    }
  });

  eventSubscription = cable.subscriptions.create(EVENT_CHANNEL, {
    connected: () => {
      // console.log(`cable: event connected ${Expo.Constants.deviceId}`);
    },
    received: (data) => {
      // console.log(`cable: event received ${Expo.Constants.deviceId}`);
      // console.log(data);
      callback(data);
    }
  });
}

export const removeSubscription = () => {
  if (cable && eventSubscription) {
    cable.subscriptions.remove(eventSubscription);
  }
  if (cable && callSubscription) {
    cable.subscriptions.remove(callSubscription);
  }
}
