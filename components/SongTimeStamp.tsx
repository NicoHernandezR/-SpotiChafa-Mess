import { View, Text } from 'react-native';
import React from 'react';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';

const SongTimeStamp = (props: {
  progress: { position: number; duration: number };
}) => {
  const numeroATimeStamp = (time: number) => {
    time = Math.floor(time);
    const minutos = Math.floor(time / 60);
    const segundos = time - minutos * 60;

    if (segundos >= 10) {
      return `${minutos}:${segundos}`;
    }

    return `${minutos}:0${segundos}`;
  };

  return (
    <View
      style={[stylesNormales.row, stylesText.viewText, stylesNormales.spaceBW]}>
      <Text style={[stylesText.text]}>
        {numeroATimeStamp(props.progress.position)}
      </Text>
      <Text style={[stylesText.text]}>
        {numeroATimeStamp(props.progress.duration - props.progress.position)}
      </Text>
    </View>
  );
};

export default SongTimeStamp;
