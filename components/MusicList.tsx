import { View, StyleSheet, FlatList, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Song from '../interface/song';
import MusicItem from './MusicItem';
import stylesNormales from '../styles/StylesNormal';
import TrackPlayer, {
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import SongControls from './SongControls';
import SongTimeStamp from './SongTimeStamp';

const MusicList = ({ navigation }) => {
  const [lista, setlista] = useState<Song[]>();
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [current, setCurrent] = useState<Track>();

  const supabaseUrl = '';
  const supabaseAnonKey = "";
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidas',
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const obtenerLista = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from('tabla_mp3')
      .select('id, title, artist')
      .order('id');

    if (data) {
      setlista(data);
    }
  };

  useEffect(() => {
    obtenerLista();
    console.log('useEffectLista');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <View style={[stylesNormales.container, styles.noCentrar]}>
      <FlatList
        style={styles.flatList}
        data={lista}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        renderItem={songData => {
          return (
            <MusicItem
              id={songData.item.id}
              title={songData.item.title}
              artist={songData.item.artist}
              nav={navigation}
            />
          );
        }}
      />
      <View style={styles.miniPlayer}>
        <SongTimeStamp progress={progress} />
        <SongControls state={playBackState} />
      </View>
    </View>
  );
};

export default MusicList;

const styles = StyleSheet.create({
  noCentrar: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  miniPlayer: {
    height: '18%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2,
  },
});
