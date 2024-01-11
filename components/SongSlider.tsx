import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import stylesNormales from '../styles/StylesNormal';

const SongSlider = () => {
  return (
    <View style={stylesNormales.center} >
      <Slider
        style={style.progressBar}
        value={10}
        minimumValue={0}
        maximumValue={100}
        thumbTintColor="#FFD369"
        minimumTrackTintColor="#FFD369"
        maximumTrackTintColor="#fff"
        onSlidingComplete ={() => {}}
      />
    </View>
  );
};

export default SongSlider;

const style = StyleSheet.create({
  progressBar: {
    width: 350,
    height: 40,
    marginTop: 20,
    flexDirection: 'row',
  },
});
