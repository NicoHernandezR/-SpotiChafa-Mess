import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'react-native';
import MusicPlayer from './components/MusicPlayer';
import stylesNormales from './styles/StylesNormal';

const App = () => {
  return (
    <View style={stylesNormales.container}>
      <StatusBar barStyle="light-content" />
      <MusicPlayer />
    </View>
  );
};

export default App;
