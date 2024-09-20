
import { create } from 'zustand';
import { getVideoDetails } from '../lib/youtubeApi'; 

interface Track {
  title: string;
  youtubeId: string;
  artist: string;
  thumbnail: string;
  favorite: boolean; 
}

interface PlaylistState {
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shouldPlayOnUpdate: boolean;
  addTrack: (track: Track) => void;
  playTrack: (index: number, shouldPlay?: boolean) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  loadPlaylist: () => void;
  updateTrack: (index: number, track: Track) => void;
  deleteTrack: (index: number) => void;
  setShouldPlayOnUpdate: (value: boolean) => void;
  toggleFavorite: (index: number) => void; 
}

const usePlaylistStore = create<PlaylistState>((set) => ({
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  shouldPlayOnUpdate: true,

  addTrack: async (track) => {
    try {
      const thumbnail = await getVideoDetails(track.youtubeId);
      set((state) => {
        const updatedPlaylist = [...state.playlist, { ...track, thumbnail, favorite: false }];
        localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
        if (state.shouldPlayOnUpdate) {
          return { playlist: updatedPlaylist, currentTrackIndex: updatedPlaylist.length - 1, isPlaying: true };
        } else {
          return { playlist: updatedPlaylist };
        }
      });
    } catch (error) {
      console.error('Failed to add track:', error);
    }
  },

  playTrack: (index, shouldPlay = true) => set({ currentTrackIndex: index, isPlaying: shouldPlay, currentTime: 0 }),

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  nextTrack: () => set((state) => {
    const newIndex = state.currentTrackIndex < state.playlist.length - 1 ? state.currentTrackIndex + 1 : 0;
    return { currentTrackIndex: newIndex, isPlaying: true, currentTime: 0 };
  }),
  
  prevTrack: () => set((state) => {
    const newIndex = state.currentTrackIndex > 0 ? state.currentTrackIndex - 1 : state.playlist.length - 1;
    return { currentTrackIndex: newIndex, isPlaying: true, currentTime: 0 };
  }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  setDuration: (duration) => set({ duration }),
  
  loadPlaylist: () => {
    const savedPlaylist = localStorage.getItem('playlist');
    if (savedPlaylist) {
      set({ playlist: JSON.parse(savedPlaylist) });
    }
  },
  
  updateTrack: (index, track) => {
    set((state) => {
      const updatedPlaylist = [...state.playlist];
      updatedPlaylist[index] = track;
      localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
      return { playlist: updatedPlaylist, shouldPlayOnUpdate: false };
    });
  },

  deleteTrack: (index) => {
    set((state) => {
      const updatedPlaylist = state.playlist.filter((_, i) => i !== index);
      localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
      return { playlist: updatedPlaylist, shouldPlayOnUpdate: false };
    });
  },

  setShouldPlayOnUpdate: (value) => set({ shouldPlayOnUpdate: value }),

  toggleFavorite: (index) => {
    set((state) => {
      const updatedPlaylist = [...state.playlist];
      updatedPlaylist[index] = { ...updatedPlaylist[index], favorite: !updatedPlaylist[index].favorite };
      localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
      return { playlist: updatedPlaylist };
    });
  },
}));

export default usePlaylistStore;