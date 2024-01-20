import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'react-native';
import MusicPlayer from './MusicPlayer';
import stylesNormales from '../styles/StylesNormal';

const MusicApp = ({navigation, route}) => {
  return (
    <View style={stylesNormales.container}>
      <StatusBar barStyle="light-content" />
      <MusicPlayer route={route} />
    </View>
  );
};

export default MusicApp;
