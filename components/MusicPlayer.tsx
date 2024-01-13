import { View } from 'react-native';
import stylesNormales from '../styles/StylesNormal';
import React, { useEffect, useState } from 'react';
import ImageSong from './ImageSong';
import SongDetails from './SongDetails';
import SongTimeStamp from './SongTimeStamp';
import SongSlider from './SongSlider';
import SongControls from './SongControls';
import Song from '../interface/song';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import TrackPlayer, {
  Track,
  Event,
  useTrackPlayerEvents,
  useProgress,
  State,
  usePlaybackState,
  RepeatMode,
  Capability,
} from 'react-native-track-player';

const togglePlayBack = async (playBackState: State | undefined) => {
  const currentTrack = await TrackPlayer.getActiveTrack();
  if (currentTrack == null) {
    return;
  }
  if (playBackState === State.Paused || playBackState === State.Ready) {
    await TrackPlayer.play();
  } else {
    await TrackPlayer.pause();
  }
};

const MusicPlayer = () => {
  const [current, setCurrent] = useState<Track>();
  const [currentQueue, setCurrentQueue] = useState<Song[]>();
  const [currentId, setCurrentId] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const [primeraVez, setPrimeraVez] = useState(false);
  const [nextOrPrev, setNextOrPrev] = useState(true);
  const progress = useProgress();
  const playBackState = usePlaybackState();

  const supabaseUrl = 'https://iebaeflhlyvezpyioeqn.supabase.co';
  const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllYmFlZmxobHl2ZXpweWlvZXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDI1MzIyNiwiZXhwIjoyMDE1ODI5MjI2fQ.Ju7AJzwn_zCEPVYOEaTj3K_amSp6onP8LHRgmaqx8ig';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidas',
    );
  }

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (!event.index) {
      return;
    }

    const nextTrack = await TrackPlayer.getActiveTrack();
    const nextId = await TrackPlayer.getActiveTrackIndex();

    setCurrent(nextTrack);
    if (nextId) {
      setCurrentId(nextId);
    }
  });

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const obtenerTotalSongs = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.from('tabla_mp3').select('count');

    if (data && data.length > 0) {
      setTotalSongs(data[0].count);
    }
  };

  const obtenerQueue = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from('tabla_mp3')
      .select('title, artist, url');
    if (data) {
      await TrackPlayer.add(data);
    }
  };

  const setUpPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.reset();
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
      });
      await obtenerQueue();
      await obtenerCurrent();
    } catch (e) {
      console.log(e);
    }
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
    await obtenerCurrent();
  };

  const skipToPrev = async () => {
    await TrackPlayer.skipToPrevious();
    await obtenerCurrent();
  };

  const obtenerCurrent = async () => {
    const cur = await TrackPlayer.getActiveTrack();
    setCurrent(cur);
  };

  useEffect(() => {
    if (primeraVez) {
      return;
    }
    setUpPlayer();
    obtenerTotalSongs();
    setPrimeraVez(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primeraVez]);

  const cargarTrackPlayerCurrent = async () => {
    await TrackPlayer.play();
  };

  useEffect(() => {
    cargarTrackPlayerCurrent();
  }, [current]);

  return (
    <View style={stylesNormales.container}>
      <ImageSong />
      <SongDetails title={current?.title} artist={current?.artist} />
      <SongSlider progress={progress} />
      <SongTimeStamp progress={progress} />
      <SongControls
        press={togglePlayBack}
        state={playBackState}
        next={skipToNext}
        prev={skipToPrev}
      />
    </View>
  );
};

export default MusicPlayer;
