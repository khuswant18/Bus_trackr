import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import RouteList from './src/RouteList';
import RouteDetail from './src/RouteDetail';

export default function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bus Trackr</Text>
      </View>

      {selectedRoute ? (
        <RouteDetail route={selectedRoute} onBack={() => setSelectedRoute(null)} />
      ) : (
        <RouteList onSelect={setSelectedRoute} />
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  header: {
    backgroundColor: '#1e88e5',
    paddingTop: Platform.OS === 'web' ? 16 : 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
