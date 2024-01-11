import React from 'react';
import { StyleSheet, View } from 'react-native';
import ImageSong from './components/ImageSong';
import SongDetails from './components/SongDetails';
import SongTimeStamp from './components/SongTimeStamp';
import { StatusBar } from 'react-native';
import SongSlider from './components/SongSlider';
import SongControls from './components/SongControls';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageSong />
      <SongDetails />
      <SongSlider />
      <SongTimeStamp />
      <SongControls />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: 'black',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewText: {
    padding: 10,
  },
  text: {
    color: 'white',
    marginHorizontal: 20,
    overflow: 'hidden',
  },
});
