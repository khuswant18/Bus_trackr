import routesData from './routes.json';

export const routes = routesData;

export function getEta(stopIndex, busIndex, minutesPerStop) {
  if (stopIndex < busIndex) return 'Passed';
  if (stopIndex === busIndex) return 'Bus is here';
  return (stopIndex - busIndex) * minutesPerStop + ' min';
}

export function getStopMessage(stopIndex, busIndex, minutesPerStop) {
  if (stopIndex < busIndex) return 'Bus has passed your stop';
  if (stopIndex === busIndex) return 'Bus is at your stop';
  return 'Your bus arrives in ' + (stopIndex - busIndex) * minutesPerStop + ' min';
}

export function nextIndex(busIndex, totalStops) {
  return busIndex + 1 < totalStops ? busIndex + 1 : 0;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return hours + ':' + mins;
}

export function getNextBuses(route, now, count = 3) {
  const current = now.getHours() * 60 + now.getMinutes();
  const times = [];

  for (let time = toMinutes(route.firstBus); time <= toMinutes(route.lastBus); time += route.every) {
    if (time >= current) times.push(toTime(time));
    if (times.length === count) break;
  }

  return times;
}

export function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestStop(routes, lat, lng) {
  let nearest = null;

  routes.forEach((route) => {
    route.stops.forEach((stop) => {
      const distance = getDistance(lat, lng, stop.lat, stop.lng);
      if (!nearest || distance < nearest.distance) {
        nearest = { stop: stop.name, route, distance };
      }
    });
  });

  return nearest;
}

export function formatDistance(km) {
  if (km < 1) return Math.round(km * 1000) + ' m';
  return km.toFixed(1) + ' km';
}
