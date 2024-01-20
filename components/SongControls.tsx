import { View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { State } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { togglePlayBack, skipToNext, skipToPrev } from '../functions/player';

const SongControls = props => {
  return (
    <View style={[styles.musicControlContainer, props.style]}>
      <Pressable
        onPress={() => {
          skipToPrev();
        }}>
        <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
      </Pressable>

      <TouchableOpacity
        onPress={() => {
          togglePlayBack(props.state.state);
        }}>
        <Ionicons
          name={
            props.state.state === State.Playing ? 'pause-circle' : 'play-circle'
          }
          size={75}
          color="#FFD369"
        />
      </TouchableOpacity>

      <Pressable
        onPress={() => {
          skipToNext();
        }}>
        <Ionicons name="play-skip-forward-outline" size={35} color="#FFD369" />
      </Pressable>
    </View>
  );
};

export default SongControls;

const styles = StyleSheet.create({
  musicControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '75%',
  },
});
