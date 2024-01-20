import React from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer from 'react-native-track-player';

const SongSlider = props => {
  return (
    <>
      <Slider
        style={[style.progressBar, props.style]}
        value={props.progress.position}
        minimumValue={0}
        maximumValue={props.progress.duration}
        thumbTintColor="#FFD369"
        minimumTrackTintColor="#FFD369"
        maximumTrackTintColor="#fff"
        onSlidingComplete={async value => {
          await TrackPlayer.seekTo(value);
        }}
      />
    </>
  );
};

export default SongSlider;

const style = StyleSheet.create({
  progressBar: {
    width: 350,
    height: 40,
    flexDirection: 'row',
  },
});
