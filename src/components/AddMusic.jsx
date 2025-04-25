/* eslint-disable react/prop-types */
import { FileAudio, FileVideo, ListMusic, Trash } from "lucide-react";
import React from "react";

const AddMedia = ({ handleFileChange, handleDrop, playlist, removeMedia, playMedia }) => {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    // Save the event for later use
    deferredPrompt = e;
    // Show the install button
    const installButton = document.getElementById("installButton");
    installButton.hidden = false;

    installButton.addEventListener("click", () => {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    });
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <label
        className="flex flex-col items-center px-2 py-2 bg-white/30 backdrop-blur-md
 text-gray-700 rounded-lg shadow-lg cursor-pointer border-2 border-gray-400 hover:border-gray-500 w-80"
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <FileAudio />
        <span className="mt-2 text-sm">
          {playlist.length ? "Add more files to Playlist" : "Choose files"}
        </span>
        <input
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          multiple // Allow multiple file selection
          onChange={(e) => handleFileChange(Array.from(e.target.files))}
        />
      </label>

      <ul className="text-xl bg-white/30 backdrop-blur-md
 rounded-lg p-2 w-80 border-2 border-gray-400 overflow-y-scroll max-h-80">
        <ListMusic className="h-6 w-6" />
        {playlist.map((file, index) => (
          <li
            key={index}
            className="flex justify-between items-center cursor-pointer bg-slate-300 my-2 rounded-lg p-2 hover:bg-slate-400 w-full truncate"
          >
            <button
              onClick={() => removeMedia(index)}
              className="mr-2 bg-slate-200 p-2 rounded-lg hover:bg-red-300"
            >
              <Trash size={20} />
            </button>
            <span onClick={() => playMedia(index)}>
              {file.type === "video" ? (
                <FileVideo className="inline-block mr-2" />
              ) : (
                <FileAudio className="inline-block mr-2" />
              )}
              {file.name}
            </span>
          </li>
        ))}
      </ul>
      <button
        id="installButton"
        className="text-xl bg-white/30 backdrop-blur-md
 rounded-lg p-2 w-40 border-2 border-gray-400 mt-[10px] max-h-40"
        hidden
      >
        Install
      </button>
      <div className="bg-back">
        ©2025 <a href="https://x.com/THE_SANDF"> THE_SANDF</a>
      </div>
    </div>
  );
};

export default AddMedia;
