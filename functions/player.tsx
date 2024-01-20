import TrackPlayer, { State } from 'react-native-track-player';

export const skipToNext = async () => {
  await TrackPlayer.skipToNext();
};

export  const skipToPrev = async () => {
  await TrackPlayer.skipToPrevious();
};

export const togglePlayBack = async (playBackState: State | undefined) => {
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

