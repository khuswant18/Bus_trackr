import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { routes, getEta, nextIndex } from './data';

export default function RouteDetail({ route, navigation }) {
  const bus = routes.find((item) => item.id === route.params.id);
  const [busIndex, setBusIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ title: bus ? 'Bus ' + bus.number : 'Bus not found' });
  }, [navigation, bus]);

  useEffect(() => {
    if (!bus) return;

    const timer = setInterval(() => {
      setBusIndex((index) => nextIndex(index, bus.stops.length));
    }, 5000);

    return () => clearInterval(timer);
  }, [bus]);

  if (!bus) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>This bus does not exist</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{bus.name}</Text>

      <View style={styles.status}>
        <Text style={styles.statusText}>Now at: {bus.stops[busIndex]}</Text>
      </View>

      <ScrollView>
        {bus.stops.map((stop, index) => (
          <View key={stop} style={styles.stopRow}>
            <View style={[styles.dot, index === busIndex && styles.activeDot, index < busIndex && styles.passedDot]} />
            <Text style={[styles.stopName, index < busIndex && styles.passedText]}>{stop}</Text>
            <Text style={styles.eta}>{getEta(index, busIndex, bus.minutesPerStop)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    marginBottom: 16,
  },
  status: {
    backgroundColor: '#1e88e5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  activeDot: {
    backgroundColor: '#43a047',
  },
  passedDot: {
    backgroundColor: '#999',
  },
  stopName: {
    flex: 1,
    fontSize: 16,
  },
  passedText: {
    color: '#999',
  },
  eta: {
    color: '#333',
    fontWeight: '600',
  },
});
