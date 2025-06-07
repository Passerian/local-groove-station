
import { useState } from 'react';
import { Search, Home, ListMusic, Heart, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Sidebar = () => {
  const { playlists, createPlaylist, setCurrentPlaylist, currentPlaylist } = useMusic();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Music Player</h1>
        
        <nav className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setCurrentPlaylist(null)}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Search className="mr-3 h-5 w-5" />
            Search
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ListMusic className="mr-3 h-5 w-5" />
            Your Library
          </Button>
        </nav>
      </div>

      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300">Playlists</h3>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {isCreating && (
          <div className="mb-3 space-y-2">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreatePlaylist}>
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-1 max-h-64 overflow-y-auto">
          {playlists.map((playlist) => (
            <Button
              key={playlist.id}
              variant="ghost"
              className={`w-full justify-start text-sm ${
                currentPlaylist === playlist.id 
                  ? 'text-green-400 bg-gray-800' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setCurrentPlaylist(playlist.id)}
            >
              <ListMusic className="mr-3 h-4 w-4" />
              {playlist.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
