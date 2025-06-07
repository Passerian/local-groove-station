
import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { NowPlaying } from '@/components/NowPlaying';
import { MainContent } from '@/components/MainContent';
import { PlaybackControls } from '@/components/PlaybackControls';
import { MusicProvider } from '@/contexts/MusicContext';

const Index = () => {
  return (
    <MusicProvider>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <MainContent />
          </div>
          <NowPlaying />
        </div>
        <PlaybackControls />
      </div>
    </MusicProvider>
  );
};

export default Index;
