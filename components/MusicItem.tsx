import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import stylesText from '../styles/StylesText';
import stylesNormales from '../styles/StylesNormal';
import React, { memo } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import stylesMusicItem from '../styles/StylesMusicItem';

const MusicItem = memo(
  props => (
    <TouchableOpacity
      onPress={() => props.nav.navigate('MusicPlayer', { id: props.id })}>
      <View
        style={[stylesNormales.row, stylesText.viewText, stylesMusicItem.item]}
        key={props.id}>
        <View style={stylesMusicItem.iconView}>
          <MaterialCommunityIcons
            style={stylesMusicItem.icon}
            name="music-note-outline"
          />
        </View>
        <View style={stylesMusicItem.textView}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[stylesMusicItem.title]}>
            {props.title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[stylesMusicItem.artist]}>
            {props.artist}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ),
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
  },
);

export default MusicItem;
