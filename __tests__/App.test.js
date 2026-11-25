import { render, screen, fireEvent, act } from '@testing-library/react-native';
import App from '../App';

beforeEach(() => {
  jest.useFakeTimers();
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

  await act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(screen.getByText('Now at: Main Market')).toBeTruthy();
  expect(screen.getByText('Passed')).toBeTruthy();
  expect(screen.getByText('12 min')).toBeTruthy();
});
