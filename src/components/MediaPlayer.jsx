/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

const MediaPlayer = ({ playlist, currentMediaIndex, setCurrentMediaIndex }) => {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const currentFile = playlist[currentMediaIndex];

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume;
      if (isPlaying) {
        mediaRef.current.play();
      } else {
        mediaRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    if (mediaRef.current) {
      // Check if the current media is already loaded
      if (mediaRef.current.src !== currentFile.url) {
        mediaRef.current.src = currentFile.url;
        mediaRef.current.load();
        mediaRef.current.onloadedmetadata = () => setDuration(mediaRef.current.duration);
        mediaRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentMediaIndex, playlist]);

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : playlist.length - 1));
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    mediaRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (mediaRef.current.requestFullscreen) {
        mediaRef.current.requestFullscreen();
      } else if (mediaRef.current.webkitRequestFullscreen) {
        mediaRef.current.webkitRequestFullscreen();
      } else if (mediaRef.current.msRequestFullscreen) {
        mediaRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="flex flex-col items-center bg-white/30 backdrop-blur-md p-4 rounded-lg w-80 overflow-hidden">
      <h1 className="text-xl font-bold">{currentFile.name}</h1>

      {currentFile.type === "video" ? (
        <div className="relative w-full">
          <video
            ref={mediaRef}
            className="w-full h-56 my-2 rounded-lg"
            onTimeUpdate={() => setCurrentTime(mediaRef.current.currentTime)}
          />
          <button
            onClick={toggleFullScreen}
            className="absolute top-2 right-2 bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          >
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      ) : (
        <audio
          ref={mediaRef}
          className="hidden"
          onTimeUpdate={() => setCurrentTime(mediaRef.current.currentTime)}
        />
      )}

      <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-1 bg-white/30 backdrop-blur-md rounded"
      />

      <div className="flex items-center gap-4 mt-4">
        <button onClick={handlePrev}>
          <SkipBack size={24} />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={handleNext}>
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center justify-center mt-3">
        {volume !== 0 ? <Volume2 size={24} className="mr-2" /> : <VolumeX size={24} className="mr-2" />}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1"
        />
      </div>
    </div>
  );
};

export default MediaPlayer;