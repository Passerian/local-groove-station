import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  src: string;
  coverArt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  coverArt?: string;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  playlists: Playlist[];
  library: Track[];
  currentPlaylist: string | null;
  searchQuery: string;
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToLibrary: (tracks: Track[]) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  setCurrentPlaylist: (playlistId: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [library, setLibrary] = useState<Track[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        if (isRepeat) {
          audioRef.current?.play();
        } else {
          next();
        }
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const play = (track: Track) => {
    console.log('Playing track:', track.title);
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.volume = volume;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    console.log('Pausing playback');
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    console.log('Resuming playback');
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const getCurrentPlaylistTracks = () => {
    if (currentPlaylist) {
      const playlist = playlists.find(p => p.id === currentPlaylist);
      return playlist?.tracks || [];
    }
    return library;
  };

  const next = () => {
    console.log('Playing next track');
    const tracks = getCurrentPlaylistTracks();
    if (!currentTrack || tracks.length === 0) return;
    
    let currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    
    play(tracks[nextIndex]);
  };

  const previous = () => {
    console.log('Playing previous track');
    const tracks = getCurrentPlaylistTracks();
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    
    play(tracks[prevIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    console.log('Shuffle toggled:', !isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    console.log('Repeat toggled:', !isRepeat);
  };

  const addToLibrary = (tracks: Track[]) => {
    console.log('Adding tracks to library:', tracks.length);
    setLibrary(prev => [...prev, ...tracks]);
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    console.log('Created playlist:', name);
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));
    console.log('Added track to playlist:', track.title);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isShuffle,
      isRepeat,
      playlists,
      library,
      currentPlaylist,
      searchQuery,
      play,
      pause,
      resume,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      addToLibrary,
      createPlaylist,
      addToPlaylist,
      setCurrentPlaylist,
      setSearchQuery
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};
