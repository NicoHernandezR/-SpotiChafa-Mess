import { View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { State } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

const SongControls = (props: {
  press: (arg0: any) => void;
  state: { state: any };
  next: any;
  prev: any;
}) => {
  return (
    <View style={styles.musicControlContainer}>
      <Pressable
        onPress={() => {
          props.prev();
        }}>
        <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
      </Pressable>

      <TouchableOpacity
        onPress={() => {
          props.press(props.state.state);
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
          props.next();
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
    marginTop: 25,
    marginBottom: 60,
  },
});
