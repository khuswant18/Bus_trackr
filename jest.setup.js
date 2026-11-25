global.fetch = jest.fn(() => Promise.reject(new Error('offline')));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
