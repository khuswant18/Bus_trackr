import {
  getEta,
  nextIndex,
  getNextBuses,
  getStopMessage,
  getDistance,
  findNearestStop,
  formatDistance,
  routes,
} from '../src/data';

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

test('shows the next three buses', () => {
  const route = { firstBus: '06:00', lastBus: '22:00', every: 15 };
  expect(getNextBuses(route, new Date(2026, 0, 1, 10, 7))).toEqual(['10:15', '10:30', '10:45']);
});

test('includes a bus leaving right now', () => {
  const route = { firstBus: '06:00', lastBus: '22:00', every: 15 };
  expect(getNextBuses(route, new Date(2026, 0, 1, 10, 15))[0]).toBe('10:15');
});

test('shows first bus early in the morning', () => {
  const route = { firstBus: '06:00', lastBus: '22:00', every: 15 };
  expect(getNextBuses(route, new Date(2026, 0, 1, 4, 0))).toEqual(['06:00', '06:15', '06:30']);
});

test('shows fewer buses near the end of the day', () => {
  const route = { firstBus: '06:00', lastBus: '22:00', every: 15 };
  expect(getNextBuses(route, new Date(2026, 0, 1, 21, 50))).toEqual(['22:00']);
});

test('shows no buses after the last one', () => {
  const route = { firstBus: '06:00', lastBus: '22:00', every: 15 };
  expect(getNextBuses(route, new Date(2026, 0, 1, 23, 0))).toEqual([]);
});

test('tells how long until the bus reaches your stop', () => {
  expect(getStopMessage(3, 1, 4)).toBe('Your bus arrives in 8 min');
  expect(getStopMessage(1, 1, 4)).toBe('Bus is at your stop');
  expect(getStopMessage(0, 1, 4)).toBe('Bus has passed your stop');
});

test('every stop has a name and location', () => {
  routes.forEach((route) => {
    route.stops.forEach((stop) => {
      expect(stop.name).toBeTruthy();
      expect(typeof stop.lat).toBe('number');
      expect(typeof stop.lng).toBe('number');
    });
  });
});

test('calculates distance between two points', () => {
  expect(getDistance(26.9124, 75.7873, 26.9124, 75.7873)).toBe(0);
  expect(getDistance(26.9124, 75.7873, 26.94, 75.818)).toBeCloseTo(4.3, 1);
});

test('finds the nearest stop', () => {
  const nearest = findNearestStop(routes, 26.8245, 75.8118);
  expect(nearest.stop).toBe('Airport');
  expect(nearest.route.number).toBe('7');
});

test('formats distance in metres or kilometres', () => {
  expect(formatDistance(0.25)).toBe('250 m');
  expect(formatDistance(3.456)).toBe('3.5 km');
});
