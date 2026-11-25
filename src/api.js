import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  let host = 'localhost';
  if (Platform.OS === 'web') {
    host = window.location.hostname;
  } else if (Constants.expoConfig?.hostUri) {
    host = Constants.expoConfig.hostUri.split(':')[0];
  }

  return 'http://' + host + ':4000';
}

async function get(path) {
  const res = await fetch(getApiUrl() + path);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export function fetchRoutes() {
  return get('/routes');
}

export async function fetchBusIndex(id) {
  const data = await get('/routes/' + id + '/bus');
  return data.busIndex;
}
