import { View, Text } from 'react-native';
import React from 'react';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';

const SongTimeStamp = (props: { progress: { position: number; duration: number; }; }) => {
  return (
    <View
      style={[stylesNormales.row, stylesText.viewText, stylesNormales.spaceBW]}>
      <Text style={[stylesText.text]}>
        {new Date(props.progress.position * 1000)
          .toLocaleTimeString()
          .substring(2, 7)}
      </Text>
      <Text style={[stylesText.text]}>
        {new Date((props.progress.duration - props.progress.position) * 1000)
          .toLocaleTimeString()
          .substring(2, 7)}
      </Text>
    </View>
  );
};

export default SongTimeStamp;
