import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function RouteMap({ stops, busIndex }) {
  const bus = stops[busIndex];
  const points = stops.map((stop) => ({ latitude: stop.lat, longitude: stop.lng }));

  return (
    <MapView
      testID="route-map"
      style={styles.map}
      initialRegion={{
        latitude: bus.lat,
        longitude: bus.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    >
      <Polyline coordinates={points} strokeColor="#1e88e5" strokeWidth={4} />

      {stops.map((stop, index) => (
        <Marker key={stop.name} coordinate={points[index]} title={stop.name} />
      ))}

      <Marker coordinate={points[busIndex]} title="Bus" pinColor="green" />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
  },
});
