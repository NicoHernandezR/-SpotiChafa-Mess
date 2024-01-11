import { View, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

const SongControls = () => {
  return (
    <View style={styles.musicControlContainer}>
      <Pressable onPress={() => {}}>
        <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
      </Pressable>

      <Pressable onPress={() => {}}>
        <Ionicons name={'pause-circle'} size={75} color="#FFD369" />
      </Pressable>

      <Pressable onPress={() => {}}>
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
