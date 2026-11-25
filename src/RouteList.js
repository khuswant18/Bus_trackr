import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoutes } from './RoutesContext';
import * as Location from 'expo-location';
import { useColors } from './theme';
import { findNearestStop, formatDistance } from './data';
import { useFavorites, sortByFavorites } from './favorites';

export default function RouteList({ navigation }) {
  const { routes, offline, refreshing, refresh } = useRoutes();
  const { favorites, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [nearest, setNearest] = useState(null);
  const [locationError, setLocationError] = useState('');
  const colors = useColors();
  const styles = getStyles(colors);

  const filtered = sortByFavorites(routes, favorites).filter((route) => {
    const text = search.toLowerCase();
    return route.number.toLowerCase().includes(text) || route.name.toLowerCase().includes(text);
  });

  async function findNearest() {
    setLocationError('');

    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setLocationError('Location permission denied');
      return;
    }

    try {
      const position = await Location.getCurrentPositionAsync();
      setNearest(findNearestStop(routes, position.coords.latitude, position.coords.longitude));
    } catch {
      setLocationError('Could not get your location');
    }
  }

  return (
    <View style={styles.container}>
      {offline && <Text style={styles.offline}>Offline - showing saved routes</Text>}

      <TextInput
        style={styles.input}
        placeholder="Search bus number or place"
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />

      {nearest ? (
        <TouchableOpacity style={styles.nearest} onPress={() => navigation.navigate('Route', { id: nearest.route.id })}>
          <Text style={styles.nearestTitle}>Nearest stop</Text>
          <Text style={styles.nearestText}>
            {nearest.stop} ({formatDistance(nearest.distance)})
          </Text>
          <Text style={styles.nearestTitle}>Bus {nearest.route.number}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.locationButton} onPress={findNearest}>
          <Text style={styles.locationText}>Find nearest stop</Text>
        </TouchableOpacity>
      )}

      {locationError !== '' && <Text style={styles.error}>{locationError}</Text>}

      <FlatList
        testID="route-list"
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={<Text style={styles.empty}>No bus found</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Route', { id: item.id })}>
            <Text style={styles.number}>{item.number}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.stops}>{item.stops.length} stops</Text>
            </View>
            <TouchableOpacity testID={'star-' + item.id} onPress={() => toggleFavorite(item.id)}>
              <Text style={styles.star}>{favorites.includes(item.id) ? '★' : '☆'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
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
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
    },
    number: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.primary,
      width: 60,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    stops: {
      color: colors.subtext,
      marginTop: 4,
    },
    locationButton: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
      padding: 12,
      alignItems: 'center',
      marginBottom: 16,
    },
    locationText: {
      color: colors.primary,
      fontWeight: '600',
    },
    nearest: {
      backgroundColor: colors.green,
      borderRadius: 10,
      padding: 14,
      marginBottom: 16,
    },
    nearestTitle: {
      color: '#fff',
    },
    nearestText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 4,
    },
    error: {
      color: '#e53935',
      textAlign: 'center',
      marginBottom: 12,
    },
    star: {
      fontSize: 26,
      color: '#f5a623',
      paddingLeft: 12,
    },
    offline: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
      textAlign: 'center',
    },
    empty: {
      textAlign: 'center',
      color: colors.subtext,
      marginTop: 40,
    },
  });
}
