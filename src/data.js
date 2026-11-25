import routesData from './routes.json';

export const routes = routesData;

export function getEta(stopIndex, busIndex, minutesPerStop) {
  if (stopIndex < busIndex) return 'Passed';
  if (stopIndex === busIndex) return 'Bus is here';
  return (stopIndex - busIndex) * minutesPerStop + ' min';
}

export function nextIndex(busIndex, totalStops) {
  return busIndex + 1 < totalStops ? busIndex + 1 : 0;
}
