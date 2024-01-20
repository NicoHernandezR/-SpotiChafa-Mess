import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MusicItem = props => {
  return (
    <TouchableOpacity
      onPress={() => props.nav.navigate('MusicPlayer', { id: props.id })}>
      <View
        style={[stylesNormales.row, stylesText.viewText, styles.item]}
        key={props.id}>
        <View style={styles.iconView}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="music-note-outline"
          />
        </View>
        <View style={styles.textView}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title]}>
            {props.title}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.artist]}>
            {props.artist}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MusicItem;

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 15,
  },
  textView: {
    width: '75%',
  },
  title: {
    fontSize: 18,
  },
  artist: {
    fontSize: 14,
  },
  iconView: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    marginRight: 10,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    fontSize: 30,
    color: 'purple',
  },
});
