import { AsyncStorage } from 'react-native';

const baseUrl = (env = 'prod') => {
  const envs = {
    dev: 'https://ac3a3798.ngrok.io/api',
    prod: 'https://confy.u2i.com/api'
  }

  return envs[env];
}

const buildUrl = (url, parameters) => {
  let qs = '';

  for (const key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      const value = parameters[key];
      qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    }
  }

  if (qs.length > 0) {
    qs = qs.substring(0, qs.length - 1);
    url = url + '?' + qs;
  }

  return url;
}


const buildHeaders = async () => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const device = JSON.parse(await AsyncStorage.getItem('device'));

  return device ? Object.assign({ 'Device': device.device_id }, headers) : headers;
}

export default class ApiService {
  static url = baseUrl
  static get = async (resource, params = {}) => {
    const base = baseUrl();
    const headers = await buildHeaders();
    const url = buildUrl(`${base}/${resource}`, params)

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (response.status === 401) {
        await AsyncStorage.clear();
      }

      if (response.ok) {
        const responseJson = await response.json();
        return responseJson;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  static post = async (resource, params = {}, parse = true) => {
    const base = baseUrl();
    const headers = await buildHeaders();

    try {
      const response = await fetch(`${base}/${resource}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(params)
      });

      if (response.status === 401) {
        await AsyncStorage.clear();
      }

      if (response.ok && parse) {
        const responseJson = await response.json();
        return responseJson;
      } else {
        return {};
      }
    } catch (error) {
      console.error(error);
    }
  }

  static put = async (resource, params = {}) => {
    const base = baseUrl();
    const headers = await buildHeaders();

    try {
      const response = await fetch(`${base}/${resource}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(params)
      });
    } catch (error) {
      console.error(error);
    }
  }
};
