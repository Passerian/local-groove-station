
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent } from '@/components/ui/card';

export const NowPlaying = () => {
  const { currentTrack } = useMusic();

  if (!currentTrack) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Now Playing</h3>
        <div className="text-center text-gray-400 py-12">
          <p>No track selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Now Playing</h3>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-6xl text-gray-500">♪</div>
          </div>
          
          <div className="text-center">
            <h4 className="text-white font-semibold text-lg mb-1 truncate">
              {currentTrack.title}
            </h4>
            <p className="text-gray-400 text-sm truncate">
              {currentTrack.artist}
            </p>
            <p className="text-gray-500 text-xs truncate mt-1">
              {currentTrack.album}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Queue</h4>
        <div className="text-gray-500 text-sm">
          No upcoming tracks
        </div>
      </div>
    </div>
  );
};
