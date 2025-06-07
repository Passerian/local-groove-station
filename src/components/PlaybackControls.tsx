
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export const PlaybackControls = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    isRepeat,
    play,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat
  } = useMusic();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      resume();
    }
  };

  const handleProgressChange = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {currentTrack ? (
            <>
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xl">♪</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {currentTrack.title}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">No track selected</div>
          )}
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              className={`text-gray-400 hover:text-white ${isShuffle ? 'text-green-400' : ''}`}
              onClick={toggleShuffle}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={previous}
              disabled={!currentTrack}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10"
              onClick={handlePlayPause}
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={next}
              disabled={!currentTrack}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className={`text-gray-400 hover:text-white ${isRepeat ? 'text-green-400' : ''}`}
              onClick={toggleRepeat}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={(value) => handleProgressChange([value[0] * duration / 100])}
              max={100}
              step={0.1}
              className="flex-1"
              disabled={!currentTrack}
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-xs text-gray-400">🔊</span>
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};
