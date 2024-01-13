import { View, Text } from 'react-native';
import React from 'react';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';

const SongDetails = (props: {
  title: string | undefined;
  artist: string | undefined;
}) => {
  return (
    <View style={[stylesText.viewText, stylesNormales.center]}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={stylesText.text}>
        {props.title || 'Titulo'}
      </Text>
      <Text numberOfLines={1} ellipsizeMode="tail" style={stylesText.text}>
        {props.artist || 'Artista'}
      </Text>
    </View>
  );
};

export default SongDetails;
