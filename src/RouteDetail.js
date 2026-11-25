import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getEta, nextIndex } from './data';

export default function RouteDetail({ route, onBack }) {
  const [busIndex, setBusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBusIndex((index) => nextIndex(index, route.stops.length));
    }, 5000);

    return () => clearInterval(timer);
  }, [route]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Bus {route.number}</Text>
      <Text style={styles.subtitle}>{route.name}</Text>

      <View style={styles.status}>
        <Text style={styles.statusText}>Now at: {route.stops[busIndex]}</Text>
      </View>

      <ScrollView>
        {route.stops.map((stop, index) => (
          <View key={stop} style={styles.stopRow}>
            <View style={[styles.dot, index === busIndex && styles.activeDot, index < busIndex && styles.passedDot]} />
            <Text style={[styles.stopName, index < busIndex && styles.passedText]}>{stop}</Text>
            <Text style={styles.eta}>{getEta(index, busIndex, route.minutesPerStop)}</Text>
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
  },
  back: {
    color: '#1e88e5',
    fontSize: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#555',
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
