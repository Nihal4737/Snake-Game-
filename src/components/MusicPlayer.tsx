import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Drive (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Synthwave Grid (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Cybernetic Void (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipTrack();
  };

  return (
    <div className="glass-panel rounded-xl p-6 w-full max-w-sm flex flex-col gap-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-neon-pink/20 blur-[50px] -z-10 rounded-full" />
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-neon-pink font-semibold">Now Playing</h2>
          <p className="font-mono text-sm mt-1 truncate max-w-[200px] text-gray-200" title={currentTrack.title}>
            {currentTrack.title}
          </p>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-gray-400 hover:text-neon-cyan transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-cyan shadow-[0_0_8px_#00f3ff] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-2">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full border border-neon-cyan/50 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/10 hover:box-glow-cyan transition-all"
        >
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="ml-1 fill-current" />}
        </button>
        <button 
          onClick={skipTrack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-neon-pink hover:bg-neon-pink/10 transition-colors"
        >
          <SkipForward size={18} className="fill-current" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
        crossOrigin="anonymous"
      />
    </div>
  );
}
