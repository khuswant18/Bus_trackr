import { useColorScheme } from 'react-native';

const light = {
  background: '#f2f4f7',
  card: '#fff',
  text: '#111',
  subtext: '#666',
  muted: '#999',
  border: '#ddd',
  dot: '#ccc',
  header: '#1e88e5',
  primary: '#1e88e5',
  green: '#43a047',
};

const dark = {
  background: '#121212',
  card: '#1f1f1f',
  text: '#f2f2f2',
  subtext: '#aaa',
  muted: '#777',
  border: '#333',
  dot: '#555',
  header: '#1f1f1f',
  primary: '#42a5f5',
  green: '#66bb6a',
};

export function useColors() {
  return useColorScheme() === 'dark' ? dark : light;
}
