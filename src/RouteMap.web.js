export default function RouteMap({ stops, busIndex }) {
  const bus = stops[busIndex];
  const lats = stops.map((stop) => stop.lat);
  const lngs = stops.map((stop) => stop.lng);

  const box = [
    Math.min(...lngs) - 0.01,
    Math.min(...lats) - 0.01,
    Math.max(...lngs) + 0.01,
    Math.max(...lats) + 0.01,
  ].join(',');

  const url =
    'https://www.openstreetmap.org/export/embed.html?bbox=' + box + '&layer=mapnik&marker=' + bus.lat + ',' + bus.lng;

  return (
    <iframe
      title="Route map"
      src={url}
      style={{ width: '100%', height: 250, border: 0, borderRadius: 10, marginBottom: 16 }}
    />
  );
}
