import { render, screen, fireEvent, act } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import routes from '../src/routes.json';

beforeEach(async () => {
  await AsyncStorage.clear();
  Notifications.scheduleNotificationAsync.mockClear();
  jest.useFakeTimers();
  fetch.mockImplementation(() => Promise.reject(new Error('offline')));
});

afterEach(() => {
  jest.useRealTimers();
});

test('shows all bus routes on start', async () => {
  await render(<App />);
  expect(screen.getByText('City Center - Railway Station')).toBeTruthy();
  expect(screen.getByText('University - Airport')).toBeTruthy();
  expect(screen.getByText('Old Town - Lake View')).toBeTruthy();
});

test('search filters the routes', async () => {
  await render(<App />);
  await fireEvent.changeText(screen.getByPlaceholderText('Search bus number or place'), 'airport');
  expect(screen.getByText('University - Airport')).toBeTruthy();
  expect(screen.queryByText('Old Town - Lake View')).toBeNull();
});

test('search shows message when nothing matches', async () => {
  await render(<App />);
  await fireEvent.changeText(screen.getByPlaceholderText('Search bus number or place'), 'xyz');
  expect(screen.getByText('No bus found')).toBeTruthy();
});

test('opening a route shows stops and the bus moves', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('City Center - Railway Station'));

  expect(screen.getByText('Now at: City Center')).toBeTruthy();
  expect(screen.getByText('16 min')).toBeTruthy();
  expect(screen.getByText('Next buses from City Center')).toBeTruthy();
  expect(screen.getByText('Every 15 min, 06:00 to 22:00')).toBeTruthy();

  await act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(screen.getByText('Now at: Main Market')).toBeTruthy();
  expect(screen.getByText('Passed')).toBeTruthy();
  expect(screen.getByText('12 min')).toBeTruthy();
});

test('shows offline message when server is not reachable', async () => {
  await render(<App />);
  expect(await screen.findByText('Offline - showing saved routes')).toBeTruthy();
});

test('uses bus position from the server', async () => {
  fetch.mockImplementation((url) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(url.endsWith('/routes') ? routes : { busIndex: 2 }),
    })
  );

  await render(<App />);
  await fireEvent.press(screen.getByText('City Center - Railway Station'));

  expect(await screen.findByText('Now at: Clock Tower')).toBeTruthy();
  expect(screen.queryByText('Offline - showing saved routes')).toBeNull();
});

test('pull to refresh loads routes again', async () => {
  await render(<App />);
  expect(await screen.findByText('Offline - showing saved routes')).toBeTruthy();

  fetch.mockImplementation((url) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(url.endsWith('/routes') ? routes : { busIndex: 0 }),
    })
  );

  await fireEvent(screen.getByTestId('route-list'), 'refresh');

  expect(screen.queryByText('Offline - showing saved routes')).toBeNull();
});

test('starring a route moves it to the top and saves it', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByTestId('star-3'));

  const names = screen.getAllByText(/ - [A-Z]/).map((node) => node.props.children);
  expect(names[0]).toBe('Old Town - Lake View');
  expect(await AsyncStorage.getItem('favorites')).toBe('["3"]');
});

test('loads saved favourites on start', async () => {
  await AsyncStorage.setItem('favorites', '["2"]');
  await render(<App />);

  expect(await screen.findByText('★')).toBeTruthy();
  const names = screen.getAllByText(/ - [A-Z]/).map((node) => node.props.children);
  expect(names[0]).toBe('University - Airport');
});

test('switching direction reverses the stops', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('Old Town - Lake View'));

  expect(screen.getByText('Towards Lake View')).toBeTruthy();
  expect(screen.getByText('Now at: Old Town')).toBeTruthy();

  await fireEvent.press(screen.getByText('Switch direction'));

  expect(screen.getByText('Towards Old Town')).toBeTruthy();
  expect(screen.getByText('Now at: Lake View')).toBeTruthy();
  expect(screen.getByText('Next buses from Lake View')).toBeTruthy();
});

test('picking a stop shows when the bus arrives there', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('City Center - Railway Station'));

  expect(screen.getByText('Tap a stop to pick it as your stop')).toBeTruthy();

  await fireEvent.press(screen.getByText('Bus Stand'));

  expect(screen.getByText('Your stop: Bus Stand')).toBeTruthy();
  expect(screen.getByText('Your bus arrives in 12 min')).toBeTruthy();

  await act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(screen.getByText('Your bus arrives in 8 min')).toBeTruthy();

  await fireEvent.press(screen.getByText('Bus Stand'));

  expect(screen.queryByText('Your stop: Bus Stand')).toBeNull();
});

test('sends an alert when the bus is one stop away', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('City Center - Railway Station'));
  await fireEvent.press(screen.getByText('Clock Tower'));

  expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();

  await act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
    content: { title: 'Bus 12A is almost here', body: 'Next stop is Clock Tower' },
    trigger: null,
  });
});
