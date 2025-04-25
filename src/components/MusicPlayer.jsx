// src/components/MusicPlayer.jsx
import React, { useState, useEffect } from "react";
import AddMedia from "./AddMusic";
import MediaPlayer from "./MediaPlayer";
import { saveFileToDB, getFileFromDB } from "../utils/idbNative";

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(1);
  const [bgColorIndex, setBgColorIndex] = useState(0);

  const bgColors = ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"];

  useEffect(() => {
    const loadPlaylist = async () => {
      const storedPlaylist = localStorage.getItem("playlist");
      if (storedPlaylist) {
        const parsedPlaylist = JSON.parse(storedPlaylist); 
        const restoredPlaylist = await Promise.all(
          parsedPlaylist.map(async (item) => {
            const file = await getFileFromDB(item.name);
            if (file) {
              const url = URL.createObjectURL(file);
              return {
                name: item.name,
                type: item.type,
                url,
              };
            } else {
              console.warn("File missing in IndexedDB:", item.name);
              return null;
            }
          })
        );
        setPlaylist(restoredPlaylist.filter(Boolean));
      }

      const storedIndex = localStorage.getItem("currentMediaIndex");
      if (storedIndex) setCurrentMediaIndex(parseInt(storedIndex, 10));
    };

    loadPlaylist();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "playlist",
      JSON.stringify(playlist.map(({ name, type }) => ({ name, type })))
    );
    localStorage.setItem("currentMediaIndex", currentMediaIndex);
  }, [playlist, currentMediaIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev < 20 ? prev + 1 : 1));
      setBgColorIndex((prev) => (prev + 1) % bgColors.length);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleFiles = async (files) => {
    const newFiles = await Promise.all(
      files.map(async (file) => {
        await saveFileToDB(file.name, file);
        const saved = await getFileFromDB(file.name);
        if (saved) {
          return {
            name: file.name,
            url: URL.createObjectURL(saved),
            type: file.type.startsWith("video") ? "video" : "audio",
          };
        } else {
          alert(`Failed to save ${file.name} offline.`);
          return null;
        }
      })
    );
    setPlaylist((prev) => [...newFiles.filter(Boolean), ...prev]);
  };

  const handleFileChange = (files) => {
    handleFiles(files);
  };

  const handleDrop = (files) => {
    handleFiles(files);
  };

  const removeMedia = (indexToRemove) => {
    setPlaylist((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div
      className="w-full min-h-screen overflow-hidden flex flex-col-reverse items-center justify-center gap-10 transition-all duration-1000"
      style={{
        backgroundColor: bgColors[bgColorIndex],
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/${bgIndex}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <style>
        {`
          @media (max-width: 768px) and (orientation: landscape) {
            div {
              backgroundSize: contain !important;
              backgroundRepeat: no-repeat;
            }
          }
        `}
      </style>
      <AddMedia
        handleFileChange={handleFileChange}
        handleDrop={handleDrop}
        playlist={playlist}
        playMedia={setCurrentMediaIndex}
        removeMedia={removeMedia}
      />
      {playlist.length > 0 && (
        <MediaPlayer
          playlist={playlist}
          currentMediaIndex={currentMediaIndex}
          setCurrentMediaIndex={setCurrentMediaIndex}
        />
      )}
    </div>
  );
};

export default MusicPlayer;