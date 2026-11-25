export const routes = [
  {
    id: '1',
    number: '12A',
    name: 'City Center - Railway Station',
    minutesPerStop: 4,
    stops: ['City Center', 'Main Market', 'Clock Tower', 'Bus Stand', 'Railway Station'],
  },
  {
    id: '2',
    number: '7',
    name: 'University - Airport',
    minutesPerStop: 6,
    stops: ['University', 'Hospital', 'Tech Park', 'Highway Gate', 'Airport'],
  },
  {
    id: '3',
    number: '21',
    name: 'Old Town - Lake View',
    minutesPerStop: 3,
    stops: ['Old Town', 'Temple Road', 'Park Street', 'Lake View'],
  },
];

export function getEta(stopIndex, busIndex, minutesPerStop) {
  if (stopIndex < busIndex) return 'Passed';
  if (stopIndex === busIndex) return 'Bus is here';
  return (stopIndex - busIndex) * minutesPerStop + ' min';
}

export function nextIndex(busIndex, totalStops) {
  return busIndex + 1 < totalStops ? busIndex + 1 : 0;
}
