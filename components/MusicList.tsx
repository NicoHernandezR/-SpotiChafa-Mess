import { View, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Song from '../interface/song';
import MusicItem from './MusicItem';
import stylesNormales from '../styles/StylesNormal';

const MusicList = ({ navigation }) => {
  const [lista, setlista] = useState<Song[]>();

  const supabaseUrl = 'https://iebaeflhlyvezpyioeqn.supabase.co';
  const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllYmFlZmxobHl2ZXpweWlvZXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDI1MzIyNiwiZXhwIjoyMDE1ODI5MjI2fQ.Ju7AJzwn_zCEPVYOEaTj3K_amSp6onP8LHRgmaqx8ig';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[stylesNormales.container, styles.noCentrar]}>
      <FlatList
        style={styles.flatList}
        data={lista}
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
});
