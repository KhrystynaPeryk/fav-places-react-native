import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import IconButton from './UI/IconButton';
import { Colors } from './constants/colors';
import Map from './screens/Map';
import PlaceDetails from './screens/PlaceDetails';
import { useEffect, useState, useCallback } from 'react';
import { init } from './util/database';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator()


export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await init();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(
    async () => {
      if (dbInitialized) {
        await SplashScreen.hideAsync();
      }
    },
    [dbInitialized]
  );

  if (!dbInitialized) return null;

  return (
    <>
      <StatusBar style='dark'/>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator screenOptions={{
          headerStyle: {backgroundColor: Colors.primary500},
          headerTintColor: Colors.gray700,
          contentStyle: {backgroundColor: Colors.gray700}
        }}>
          <Stack.Screen 
            name='AllPlaces' 
            component={AllPlaces} 
            // by converting options into a function, we can get hold of navigation obj
            options={({navigation}) => ({
              title: 'Your Favourite Places',
              headerRight: ({tintColor}) => <IconButton icon='add' color={tintColor} size={24} onPress={() => navigation.navigate('AddPlace')}/>
            })}
          />
          <Stack.Screen 
            name='AddPlace' 
            component={AddPlace} 
            options={{
              title: 'Add a new Place'
            }}
          />
          <Stack.Screen name='Map' component={Map} />
          <Stack.Screen name='PlaceDetails' component={PlaceDetails} options={{
            title: 'Loading Place...'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
