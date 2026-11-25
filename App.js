import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import RouteList from './src/RouteList';
import RouteDetail from './src/RouteDetail';

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
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1e88e5' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#f2f4f7' },
        }}
      >
        <Stack.Screen name="Home" component={RouteList} options={{ title: 'Bus Trackr' }} />
        <Stack.Screen name="Route" component={RouteDetail} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
