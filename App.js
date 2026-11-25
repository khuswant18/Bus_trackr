import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import RouteList from './src/RouteList';
import RouteDetail from './src/RouteDetail';
import { useColors } from './src/theme';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: '',
      Route: 'route/:id',
    },
  },
};

export default function App() {
  const scheme = useColorScheme();
  const colors = useColors();

  return (
    <NavigationContainer linking={linking} theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={RouteList} options={{ title: 'Bus Trackr' }} />
        <Stack.Screen name="Route" component={RouteDetail} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
