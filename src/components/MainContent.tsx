
import { useRef } from 'react';
import { Search, Upload, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const MainContent = () => {
  const { 
    library, 
    playlists, 
    currentPlaylist, 
    searchQuery, 
    setSearchQuery, 
    addToLibrary, 
    play,
    currentTrack
  } = useMusic();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentTracks = () => {
    if (currentPlaylist) {
      const playlist = playlists.find(p => p.id === currentPlaylist);
      return playlist?.tracks || [];
    }
    return library;
  };

  const filteredTracks = getCurrentTracks().filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0,
      src: URL.createObjectURL(file)
    }));

    addToLibrary(newTracks);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPlaylistName = currentPlaylist 
    ? playlists.find(p => p.id === currentPlaylist)?.name 
    : 'Your Library';

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search songs, artists, or albums..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Music
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">{currentPlaylistName}</h2>
        <p className="text-gray-400">{filteredTracks.length} songs</p>
      </div>

      {filteredTracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No music in your library yet</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Your First Songs
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTracks.map((track, index) => (
            <Card 
              key={track.id} 
              className={`bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                currentTrack?.id === track.id ? 'bg-gray-600/50 border-green-500' : ''
              }`}
              onClick={() => play(track)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center">
                    {currentTrack?.id === track.id ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    ) : (
                      <Play className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{track.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                  </div>
                  
                  <div className="text-gray-400 text-sm">
                    {track.album}
                  </div>
                  
                  <div className="text-gray-400 text-sm w-12 text-right">
                    {track.duration > 0 ? formatDuration(track.duration) : '--:--'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
