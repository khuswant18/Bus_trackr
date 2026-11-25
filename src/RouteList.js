import { View, Text, FlatList, StyleSheet } from 'react-native';
import { routes } from './data';

export default function RouteList() {
  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.number}>{item.number}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.stops}>{item.stops.length} stops</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  number: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e88e5',
    width: 60,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  stops: {
    color: '#777',
    marginTop: 4,
  },
});
