import { View, Text } from 'react-native';
import React from 'react';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';

const SongDetails = () => {
  return (
    <View style={[stylesText.viewText, stylesNormales.center]}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={stylesText.text}>
        Nombre de la cancion
      </Text>
      <Text numberOfLines={1} ellipsizeMode="tail" style={stylesText.text}>
        Artista
      </Text>
    </View>
  );
};

export default SongDetails;
