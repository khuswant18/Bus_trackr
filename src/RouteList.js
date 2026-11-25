import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { routes } from './data';
import { useColors } from './theme';

export default function RouteList({ navigation }) {
  const [search, setSearch] = useState('');
  const colors = useColors();
  const styles = getStyles(colors);

  const filtered = routes.filter((route) => {
    const text = search.toLowerCase();
    return route.number.toLowerCase().includes(text) || route.name.toLowerCase().includes(text);
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search bus number or place"
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No bus found</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Route', { id: item.id })}>
            <Text style={styles.number}>{item.number}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.stops}>{item.stops.length} stops</Text>
            </View>
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
    empty: {
      textAlign: 'center',
      color: colors.subtext,
      marginTop: 40,
    },
  });
}
