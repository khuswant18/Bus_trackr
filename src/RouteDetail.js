import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getEta, nextIndex, getNextBuses, getStopMessage } from './data';
import { useRoutes } from './RoutesContext';
import { fetchBusIndex } from './api';
import { askForAlerts, sendAlert } from './alerts';
import { useColors } from './theme';

export default function RouteDetail({ route, navigation }) {
  const { routes, offline } = useRoutes();
  const bus = routes.find((item) => item.id === route.params.id);
  const [busIndex, setBusIndex] = useState(0);
  const [reversed, setReversed] = useState(false);
  const [myStop, setMyStop] = useState(null);
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

  const allStops = bus ? bus.stops : [];
  const stops = reversed ? [...allStops].reverse() : allStops;
  const myIndex = stops.indexOf(myStop);

  useEffect(() => {
    if (myIndex >= 0 && myIndex - busIndex === 1) {
      sendAlert('Bus ' + bus.number + ' is almost here', 'Next stop is ' + myStop);
    }
  }, [busIndex, myIndex]);

  if (!bus) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>This bus does not exist</Text>
      </View>
    );
  }

  const nextBuses = getNextBuses(bus, new Date());

  function pickStop(stop) {
    if (stop === myStop) {
      setMyStop(null);
    } else {
      setMyStop(stop);
      askForAlerts();
    }
  }

  function switchDirection() {
    setReversed(!reversed);
    setBusIndex(0);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{bus.name}</Text>

      <View style={styles.directionRow}>
        <Text style={styles.direction}>Towards {stops[stops.length - 1]}</Text>
        <TouchableOpacity style={styles.switchButton} onPress={switchDirection}>
          <Text style={styles.switchText}>Switch direction</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.status}>
        <Text style={styles.statusText}>Now at: {stops[busIndex]}</Text>
      </View>

      {myIndex >= 0 ? (
        <View style={styles.myStop}>
          <Text style={styles.myStopTitle}>Your stop: {myStop}</Text>
          <Text style={styles.myStopText}>{getStopMessage(myIndex, busIndex, bus.minutesPerStop)}</Text>
        </View>
      ) : (
        <Text style={styles.hint}>Tap a stop to pick it as your stop</Text>
      )}

      <View style={styles.timetable}>
        <Text style={styles.timetableTitle}>Next buses from {stops[0]}</Text>
        <Text style={styles.timetableText}>
          {nextBuses.length > 0 ? nextBuses.join('   ') : 'No more buses today'}
        </Text>
        <Text style={styles.timetableInfo}>
          Every {bus.every} min, {bus.firstBus} to {bus.lastBus}
        </Text>
      </View>

      <ScrollView>
        {stops.map((stop, index) => (
          <TouchableOpacity
            key={stop}
            style={[styles.stopRow, stop === myStop && styles.myStopRow]}
            onPress={() => pickStop(stop)}
          >
            <View style={[styles.dot, index === busIndex && styles.activeDot, index < busIndex && styles.passedDot]} />
            <Text style={[styles.stopName, index < busIndex && styles.passedText]}>{stop}</Text>
            <Text style={styles.eta}>{getEta(index, busIndex, bus.minutesPerStop)}</Text>
          </TouchableOpacity>
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
      marginBottom: 8,
    },
    directionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    direction: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
    },
    switchButton: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    switchText: {
      color: colors.primary,
      fontWeight: '600',
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
    myStop: {
      backgroundColor: colors.green,
      borderRadius: 10,
      padding: 14,
      marginBottom: 16,
    },
    myStopTitle: {
      color: '#fff',
    },
    myStopText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 4,
    },
    hint: {
      color: colors.muted,
      textAlign: 'center',
      marginBottom: 16,
    },
    myStopRow: {
      borderWidth: 2,
      borderColor: colors.green,
    },
    timetable: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 14,
      marginBottom: 16,
    },
    timetableTitle: {
      color: colors.subtext,
      marginBottom: 6,
    },
    timetableText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    timetableInfo: {
      color: colors.muted,
      marginTop: 6,
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
