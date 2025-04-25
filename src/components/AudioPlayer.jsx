/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ playlist, setPlaylist, currentSongIndex, setCurrentSongIndex }) => {
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Load playlist and playback state from localStorage on mount
  useEffect(() => {
    const storedPlaylist = localStorage.getItem('playlist');
    const storedIndex = localStorage.getItem('currentSongIndex');
    const storedTime = localStorage.getItem('currentTime');
    const storedVolume = localStorage.getItem('volume');
    const storedIsPlaying = localStorage.getItem('isPlaying');

    if (storedPlaylist) {
      setPlaylist(JSON.parse(storedPlaylist));
    }
    if (storedIndex !== null) {
      setCurrentSongIndex(parseInt(storedIndex, 10));
    }
    if (storedTime !== null) {
      setCurrentTime(parseFloat(storedTime));
    }
    if (storedVolume !== null) {
      setVolume(parseFloat(storedVolume));
    }
    if (storedIsPlaying !== null) {
      setIsPlaying(storedIsPlaying === 'true');
    }
  }, [setPlaylist, setCurrentSongIndex]);

  // Save playlist and playback state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('currentSongIndex', currentSongIndex);
    localStorage.setItem('currentTime', currentTime);
    localStorage.setItem('volume', volume);
    localStorage.setItem('isPlaying', isPlaying);
  }, [playlist, currentSongIndex, currentTime, volume, isPlaying]);

  const handleNext = useCallback(() => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0); // Restart playlist from the beginning
    }
  }, [currentSongIndex, setCurrentSongIndex, playlist]);

  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.volume = volume;
      if (isPlaying) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  }, [isPlaying, audioPlayer, volume]);

  useEffect(() => {
    if (audioPlayer && playlist[currentSongIndex]) {
      audioPlayer.src = playlist[currentSongIndex].url;
      audioPlayer.currentTime = currentTime; // Restore playback position
      if (isPlaying) {
        audioPlayer.play();
      }
    }
  }, [currentSongIndex, playlist, audioPlayer, currentTime, isPlaying]);

  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.addEventListener('ended', handleNext);
      return () => {
        audioPlayer.removeEventListener('ended', handleNext);
      };
    }
  }, [audioPlayer, handleNext]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioPlayer.currentTime);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioPlayer.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioPlayer.volume = newVolume;
    setVolume(newVolume);
  };

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <div className="flex items-center justify-center flex-col py-6 px-4 rounded-lg w-80 min-h-40 border-2 border-gray-400 bg-white/30 backdrop-blur-md text-gray-800">
      {playlist.length > 0 && (
        <>
          <h1 className="text-2xl font-semibold capitalize w-full truncate mb-2">{playlist[currentSongIndex].name}</h1>
          <audio
            ref={(ref) => setAudioPlayer(ref)}
            onTimeUpdate={handleTimeUpdate}
            className="my-4"
          />
          <div className="flex items-center justify-between w-full text-xs font-medium gap-3">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={audioPlayer && audioPlayer.duration ? audioPlayer.duration : 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full my-4 appearance-none h-1 rounded-lg focus:outline-none"
              style={{
                background: `linear-gradient(to right, #c0c0c0 ${
                  (currentTime / (audioPlayer && audioPlayer.duration ? audioPlayer.duration : 1)) * 100
                }%, #fdfdfd ${
                  (currentTime / (audioPlayer && audioPlayer.duration ? audioPlayer.duration : 1)) * 100
                }%)`,
              }}
            />
            <span>{formatTime(audioPlayer && audioPlayer.duration)}</span>
          </div>

          <div className="flex items-center justify-around border border-slate-200 bg-gray-300 rounded-full p-2 w-full">
            <button onClick={handlePrev} className="mr-4">
              <SkipBack size={24} />
            </button>
            <button onClick={handlePlayPause} className="mx-4">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={handleNext} className="ml-4">
              <SkipForward size={24} />
            </button>
          </div>
          <div className="flex items-center justify-center">
            {volume !== 0 ? <Volume2 size={24} className="mr-2" /> : <VolumeX size={24} className="mr-2" />}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;



