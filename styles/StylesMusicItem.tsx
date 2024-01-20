import { StyleSheet } from 'react-native';

const stylesMusicItem = StyleSheet.create({
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

export default stylesMusicItem;
