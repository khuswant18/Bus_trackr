import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getEta } from './data';

export default function RouteDetail({ route, onBack }) {
  const [busIndex] = useState(0);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Bus {route.number}</Text>
      <Text style={styles.subtitle}>{route.name}</Text>

      <ScrollView>
        {route.stops.map((stop, index) => (
          <View key={stop} style={styles.stopRow}>
            <Text style={styles.stopName}>{stop}</Text>
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
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  stopName: {
    flex: 1,
    fontSize: 16,
  },
  eta: {
    color: '#333',
    fontWeight: '600',
  },
});
