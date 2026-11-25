import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getEta, nextIndex } from './data';
import { useRoutes } from './RoutesContext';
import { fetchBusIndex } from './api';
import { useColors } from './theme';

export default function RouteDetail({ route, navigation }) {
  const { routes, offline } = useRoutes();
  const bus = routes.find((item) => item.id === route.params.id);
  const [busIndex, setBusIndex] = useState(0);
  const styles = getStyles(useColors());

  useLayoutEffect(() => {
    navigation.setOptions({ title: bus ? 'Bus ' + bus.number : 'Bus not found' });
  }, [navigation, bus]);

  useEffect(() => {
    if (!bus) return;

    function moveLocally() {
      setBusIndex((index) => nextIndex(index, bus.stops.length));
    }

    async function update() {
      if (offline) return moveLocally();

      try {
        setBusIndex(await fetchBusIndex(bus.id));
      } catch {
        moveLocally();
      }
    }

    if (!offline) update();
    const timer = setInterval(update, 5000);

    return () => clearInterval(timer);
  }, [bus, offline]);

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

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    subtitle: {
      color: colors.subtext,
      fontSize: 16,
      marginBottom: 16,
    },
    status: {
      backgroundColor: colors.primary,
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
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 14,
      marginBottom: 8,
    },
    dot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.dot,
      marginRight: 12,
    },
    activeDot: {
      backgroundColor: colors.green,
    },
    passedDot: {
      backgroundColor: colors.muted,
    },
    stopName: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    passedText: {
      color: colors.muted,
    },
    eta: {
      color: colors.text,
      fontWeight: '600',
    },
  });
}
