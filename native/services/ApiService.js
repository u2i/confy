import { AsyncStorage } from 'react-native';
import { create } from 'apisauce'

const baseUrl = (env = 'prod') => {
  const envs = {
    dev: 'https://7de18b90.ngrok.io/api',
    prod: 'https://confy.u2i.com/api'
  }
  return envs[env];
}

const api = create({
  baseURL: baseUrl(),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

const authHeaders = async () => {
  const device = JSON.parse(await AsyncStorage.getItem('device')) || {};

  return {
    'Device': device.device_id
  }
}

export default class ApiService {
  static url = baseUrl

  static get = async (resource, params = {}) => {
    api.setHeaders(await authHeaders());
    const response = await api.get(resource, params)

    if (response.status === 401) {
      await AsyncStorage.clear();
    }

    return response.data;
  }

  static post = async (resource, params = {}) => {
    api.setHeaders(await authHeaders());
    const response = await api.post(resource, params)

    if (response.status === 401) {
      await AsyncStorage.clear();
    }

    return response.data;
  }

  static put = async (resource, params = {}) => {
    api.setHeaders(await authHeaders());
    const response = await api.put(resource, params)

    if (response.status === 401) {
      await AsyncStorage.clear();
    }

    return response.data;
  }
};
