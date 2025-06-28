import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import DetailScreen from './screens/DetailScreen';
import { Icon } from 'react-native-elements';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomHeader({ title }) {
  return (
    <SafeAreaView edges={['top']} style={{
      backgroundColor: '#43a047',
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      shadowColor: '#222',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 10 },
      elevation: 4,
      paddingHorizontal: 18,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 13,
        paddingBottom: 18,
      }}>
        <Icon name="soccer" type="material-community" color="#FFD700" size={28} />
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginLeft: 12 }}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Home') {
            return <Icon name="soccer" type="material-community" color={focused ? '#43a047' : '#bbb'} size={size} />;
          }
          if (route.name === 'Favorites') {
            return <Icon name={route.name === 'Favorites' ? 'heart' : 'star'} type="material-community" color={focused ? (route.name === 'Favorites' ? '#e53935' : '#FFD700') : '#bbb'} size={size} />;
          }
        },
        tabBarActiveTintColor: '#43a047',
        tabBarInactiveTintColor: '#bbb',
        tabBarStyle: {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 80,
          paddingBottom: 8,
          marginBottom: 12,
          shadowColor: '#43a047',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 13 },
        header: () => <CustomHeader title={route.name === 'Home' ? 'Trang chủ' : 'Yêu thích'} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: 'Yêu thích' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            header: () => <CustomHeader title="Chi tiết cầu thủ" />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
