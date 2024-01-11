import { View, Text } from 'react-native';
import React from 'react';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';

const SongTimeStamp = () => {
  return (
    <View style={[stylesNormales.row, stylesText.viewText, stylesNormales.spaceBW]}>
      <Text style={[stylesText.text]}>0:00</Text>
      <Text style={[stylesText.text]}>3:20</Text>
    </View>
  );
};

export default SongTimeStamp;
