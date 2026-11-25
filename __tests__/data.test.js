import { getEta, nextIndex, routes } from '../src/data';

test('shows passed for stops behind the bus', () => {
  expect(getEta(0, 2, 4)).toBe('Passed');
});

test('shows bus is here for the current stop', () => {
  expect(getEta(2, 2, 4)).toBe('Bus is here');
});

test('calculates minutes for stops ahead', () => {
  expect(getEta(4, 1, 4)).toBe('12 min');
});

test('moves to next stop and loops back at the end', () => {
  expect(nextIndex(0, 5)).toBe(1);
  expect(nextIndex(4, 5)).toBe(0);
});

test('every route has a number, name and stops', () => {
  routes.forEach((route) => {
    expect(route.number).toBeTruthy();
    expect(route.name).toBeTruthy();
    expect(route.stops.length).toBeGreaterThan(1);
  });
});
