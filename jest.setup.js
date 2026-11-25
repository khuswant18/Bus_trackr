global.fetch = jest.fn(() => Promise.reject(new Error('offline')));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Mock = (props) => React.createElement(View, props);
  return { __esModule: true, default: Mock, Marker: Mock, Polyline: Mock };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 26.9262, longitude: 75.8031 } })),
}));
