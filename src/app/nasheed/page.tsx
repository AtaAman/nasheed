"use client";
import { useState } from "react";
import usePlaylistStore from "../../stores/usePlaylistStore";
import { getVideoDetails } from "@/lib/youtubeApi";
import { FaHeart, FaEdit, FaTrash, FaPlay, FaPause } from "react-icons/fa";
import PlaylistMusicPlayer from "@/components/MusicPlayer/PlaylistMusicPlayer";

const Playlist = () => {
  const {
    playlist,
    playTrack,
    updateTrack,
    deleteTrack,
    toggleFavorite,
    isPlaying,
    currentTrackIndex,
    togglePlayPause,
  } = usePlaylistStore();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedTrack, setEditedTrack] = useState({
    title: "",
    artist: "",
    url: "",
  });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedTrack({
      title: playlist[index].title,
      artist: playlist[index].artist,
      url: `https://youtu.be/${playlist[index].youtubeId}`,
    });
  };

  const handleClosePlayer = () => {
    setIsPlayerVisible(false);
    togglePlayPause();
  };

  const handleSaveEdit = async () => {
    if (editIndex !== null) {
      const youtubeId = extractYouTubeId(editedTrack.url);
      if (youtubeId) {
        try {
          const thumbnail = await getVideoDetails(youtubeId);
          updateTrack(editIndex, {
            ...editedTrack,
            youtubeId,
            thumbnail,
            favorite: false,
          });
          setEditIndex(null);
          setEditedTrack({ title: "", artist: "", url: "" });
        } catch (error) {
          console.error("Failed to get video details:", error);
        }
      } else {
        console.warn("Invalid YouTube URL");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedTrack({ title: "", artist: "", url: "" });
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

  function extractYouTubeId(url: string): string | null {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|e\/|watch\?v=|embed\/|user\/\S+\/|playlist\?list=))|(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const filteredPlaylist = playlist.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTracks = showFavorites
    ? playlist.filter((track) => track.favorite)
    : filteredPlaylist;

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
            <li
              key={index}
              className={`group bg-[#141414] hover:bg-[#0e0d0d] shadow-lg rounded-lg p-4 flex flex-col space-y-4 hover:shadow-xl transition-shadow relative ${
                hoverIndex === index ? "ring-2 ring-green-950" : ""
              }`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-35 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-xl text-white">
                    {track.title}
                  </h3>
                  <p className="text-gray-400">{track.artist}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 hidden group-hover:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTrack(index);
                  }}
                  className="bg-white rounded-full p-2 text-black"
                >
                  {isPlaying && currentTrackIndex === index ? (
                    <FaPause size={16} />
                  ) : (
                    <FaPlay size={16} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(index);
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold flex items-center space-x-2 ${
                    track.favorite ? "text-red-700" : "text-white"
                  }`}
                >
                  <FaHeart size={18} />
                </button>
                <div className="flex items-center space-x-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                    className="text-gray-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <FaEdit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center">No tracks found</li>
        )}
      </ul>

      {editIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/40 p-6 rounded-lg shadow-lg w-96 md:w-[50%] relative">
            <button
              onClick={handleCancelEdit}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Nasheed</h2>
            <input
              type="text"
              value={editedTrack.title}
              onChange={(e) =>
                setEditedTrack({ ...editedTrack, title: e.target.value })
              }
              placeholder="Enter Song Title"
              className="mb-3 p-3 border border-gray-300 rounded-lg shadow-sm w-full"
            />
            <input
              type="text"
              value={editedTrack.artist}
              onChange={(e) =>
                setEditedTrack({ ...editedTrack, artist: e.target.value })
              }
              placeholder="Enter Artist Name"
              className="mb-3 p-3 border border-gray-300 rounded-lg shadow-sm w-full"
            />
            <input
              type="text"
              value={editedTrack.url}
              onChange={(e) =>
                setEditedTrack({ ...editedTrack, url: e.target.value })
              }
              placeholder="Enter YouTube Music Video URL"
              className="mb-3 p-3 border border-gray-300 rounded-lg shadow-sm w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSaveEdit}
                className="bg-black/70 hover:bg-black text-white font-bold py-1 md:py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 md:py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
