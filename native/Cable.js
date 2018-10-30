import ActionCable from 'react-native-actioncable';

const EVENT_CHANNEL = 'EventChannel';
let cable;
let subscription;

export const createSubscription = (callback) => {
  console.log('cable: subscribe');

  cable = ActionCable.createConsumer('https://1e6abe1f.ngrok.io/cable?x');
  subscription = cable.subscriptions.create(EVENT_CHANNEL, {
    connected: () => {
      console.log('cable: connected');
    },
    received: (data) => {
      console.log('cable: received');
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
