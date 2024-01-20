import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MusicApp from './components/MusicApp';
import MusicList from './components/MusicList';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          statusBarHidden: false,
          headerShown: false,
        }}>
        <Stack.Screen name="ListaSongs" component={MusicList} />
        <Stack.Screen name="MusicPlayer" component={MusicApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
