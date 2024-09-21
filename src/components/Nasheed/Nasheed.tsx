"use client";
import { useState, useEffect } from "react";
import usePlaylistStore from "../../stores/usePlaylistStore";
import TrackItem from "../ui/TrackItem";
import PlaylistMusicPlayer from "@/components/ui/PlaylistMusicPlayer";
import EditTrackModal from "@/components/ui/EditTrack";

const Playlist = () => {
  const {
    playlist,
    playTrack,
    deleteTrack,
    toggleFavorite,
    isPlaying,
    currentTrackIndex,
    togglePlayPause,
    loadPlaylist,
  } = usePlaylistStore();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      loadPlaylist();
      setLoading(false);
    } catch (err) {
      console.error("Failed to load playlist", err);
      setError("Failed to load playlist.");
      setLoading(false);
    }
  }, [loadPlaylist]);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setIsPlayerVisible(false);
  };

  const handleClosePlayer = () => {
    setIsPlayerVisible(false);
    togglePlayPause();
  };

  const handleDelete = (index: number) => {
    deleteTrack(index);
  };

  const handleToggleFavorite = (index: number) => {
    toggleFavorite(index);
  };

  const handlePlayTrack = (index: number) => {
    if (isPlaying && currentTrackIndex === index) {
      togglePlayPause();
    } else {
      playTrack(index);
      setIsPlayerVisible(true);
    }
  };

  const filteredPlaylist = playlist.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTracks = showFavorites
    ? playlist.filter((track) => track.favorite)
    : filteredPlaylist;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading playlist...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showFavorites ? "Show All Tracks" : "Show Favorites"}
      </button>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or artist"
          className="p-2 border bg-green-800/20 text-white border-gray-300 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayedTracks.length > 0 ? (
          displayedTracks.map((track, index) => (
            <TrackItem
              key={index}
              track={track}
              index={index}
              isPlaying={isPlaying}
              currentTrackIndex={currentTrackIndex}
              hoverIndex={hoverIndex}
              handlePlayTrack={handlePlayTrack}
              handleToggleFavorite={handleToggleFavorite}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setHoverIndex={setHoverIndex}
            />
          ))
        ) : (
          <li className="text-gray-500 text-center">No tracks found</li>
        )}
      </ul>

      {editIndex !== null && (
        <EditTrackModal
          editIndex={editIndex}
          track={{
            title: playlist[editIndex].title,
            artist: playlist[editIndex].artist,
            url: `https://youtu.be/${playlist[editIndex].youtubeId}`,
          }}
          onClose={() => setEditIndex(null)}
        />
      )}

      {isPlayerVisible && (
        <div className="fixed w-full left-0 bottom-10 z-50">
          <button
            onClick={handleClosePlayer}
            className="bg-white hover:bg-green-700 px-3.5 py-2 font-extrabold text-black rounded-full"
          >
            X
          </button>
          <PlaylistMusicPlayer />
        </div>
      )}
    </div>
  );
};

export default Playlist;
