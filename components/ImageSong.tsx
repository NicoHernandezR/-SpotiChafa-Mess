import { StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import stylesNormales from '../styles/StylesNormal';
import React from 'react';

const ImageSong = () => {
  return (
    <View style={stylesNormales.center}>
      <View style={styles.viewIcon}>
        <MaterialIcons style={styles.icon} name="library-music" />
      </View>
    </View>
  );
};

export default ImageSong;

const styles = StyleSheet.create({
  viewIcon: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '92.5%',
    aspectRatio: 1 / 1,
    backgroundColor: 'rgb(0, 74, 119)',
    borderRadius: 30,
  },
  icon: {
    fontSize: 100,
    color: 'rgb(127, 208,255)',
  },
});
