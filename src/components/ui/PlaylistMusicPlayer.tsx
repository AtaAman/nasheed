"use client";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaHeart,
} from "react-icons/fa";

import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import usePlaylistStore from "../../stores/usePlaylistStore";
import { useEffect, useState } from "react";

import { getVideoDetails } from "@/lib/youtubeApi";

const YouTubeMusicPlayer = () => {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    nextTrack,
    prevTrack,
    togglePlayPause,
    setCurrentTime,
    setDuration,
    loadPlaylist,
    toggleFavorite,
  } = usePlaylistStore();

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (playlist.length > 0) {
        const youtubeId = playlist[currentTrackIndex]?.youtubeId;
        if (youtubeId) {
          const thumbnailUrl = await getVideoDetails(youtubeId);
          setThumbnail(thumbnailUrl);
        }
      }
    };
    fetchThumbnail();
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    if (player && playlist.length > 0) {
      player.loadVideoById(playlist[currentTrackIndex]?.youtubeId);
    }
  }, [currentTrackIndex, player]);

  const onReady = (event: YouTubeEvent) => {
    const playerInstance = event.target;
    setPlayer(playerInstance);
    setDuration(playerInstance.getDuration());

    if (isPlaying) {
      playerInstance.playVideo();
    }
  };

  //auto play next song

  const onStateChange = (event: YouTubeEvent) => {
    const playerState = event.data;
    if (playerState === 0) {
      nextTrack();
    }
  };

  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying, player]);

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [player, setCurrentTime]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (Number(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    player?.seekTo(newTime);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleToggleFavorite = () => {
    if (playlist[currentTrackIndex]) {
      toggleFavorite(currentTrackIndex);
    }
  };

  const currentTrack = playlist[currentTrackIndex];

  return (
    <div className="youtube-player w-full bg-[#121212]/90 rounded-2xl flex flex-col items-center p-5 text-white shadow-lg">
      <YouTube
        videoId={currentTrack?.youtubeId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
      <div className="w-full mt-10 flex justify-between px-5">
        <div>
          <h1 className="text-2xl font-bold">
            {currentTrack?.title || "No track"}
          </h1>
          <h2 className="text-md font-light text-gray-200">
            {currentTrack?.artist || "No artist"}
          </h2>
        </div>
        <div className="thumbnail w-30 items-center justify-center flex ">
          <img
            src={thumbnail}
            alt={currentTrack?.title || ""}
            className="w-full rounded-xl object-cover"
          />
        </div>
      </div>

      <div className="controls">
        <div className="flex flex-row gap-10">
          <button onClick={prevTrack} className="text-white hover:text-slate-900">
            <FaStepBackward size={18} />
          </button>
          <button
            onClick={handlePlayPause}
            className="text-black/80 p-5 flex rounded-full bg-white hover:text-slate-900"
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          <button
            onClick={nextTrack}
            className="text-white hover:text-slate-900"
          >
            <FaStepForward size={18} />
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`text-${currentTrack?.favorite ? "red" : "white"}-500 hover:text-${currentTrack?.favorite ? "red" : "green"}-700`}
          >
            <FaHeart size={24} />
          </button>
        </div>
      </div>

      <div className="progress-container w-full flex flex-col items-center mt-6">
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="time-info flex justify-between w-full mt-2 text-xs text-white">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default YouTubeMusicPlayer;
