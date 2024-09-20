"use client";
import { useState } from 'react';
import usePlaylistStore from '../../stores/usePlaylistStore';
import { getVideoDetails } from '@/lib/youtubeApi';

const Playlist = () => {
  const { playlist, playTrack, updateTrack, deleteTrack, setShouldPlayOnUpdate, toggleFavorite } = usePlaylistStore();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedTrack, setEditedTrack] = useState({ title: '', artist: '', url: '' });
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedTrack({
      title: playlist[index].title,
      artist: playlist[index].artist,
      url: `https://youtu.be/${playlist[index].youtubeId}`
    });
    setShouldPlayOnUpdate(false);
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
            favorite: false
          });
          setEditIndex(null);
          setEditedTrack({ title: '', artist: '', url: '' });
          setShouldPlayOnUpdate(true);
        } catch (error) {
          console.error('Failed to get video details:', error);
        }
      } else {
        console.warn('Invalid YouTube URL');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedTrack({ title: '', artist: '', url: '' });
  };

  const handleDelete = (index: number) => {
    deleteTrack(index);
    setShouldPlayOnUpdate(false);
  };

  const handleToggleFavorite = (index: number) => {
    toggleFavorite(index);
  };

  function extractYouTubeId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|e\/|watch\?v=|embed\/|user\/\S+\/|playlist\?list=))|(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const filteredPlaylist = playlist.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTracks = showFavorites
    ? playlist.filter(track => track.favorite)
    : filteredPlaylist;

  return (
    <div>
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showFavorites ? 'Show All Tracks' : 'Show Favorites'}
      </button>
      <div className="search mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or artist"
          className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
        />
      </div>
      <ul className="playlist w-full">
        {displayedTracks.length > 0 ? (
          displayedTracks.map((track, index) => (
            <li
              key={index}
              className="cursor-pointer py-2 px-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              onClick={() => playTrack(index, false)} // Adjust this as needed
            >
              <div className="flex items-center justify-between">
                <span>Title: {track.title}</span>
                <span>Artist: {track.artist}</span>
                <img src={track.thumbnail} alt={track.title} className="w-12 h-12 object-cover ml-2" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(index);
                  }}
                  className={`text-${track.favorite ? 'red' : 'gray'}-500 hover:text-${track.favorite ? 'red' : 'gray'}-700 ml-2`}
                >
                  {track.favorite ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(index);
                }}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                Delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(index);
                }}
                className="text-blue-500 hover:text-blue-700 ml-2"
              >
                Edit
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center">{showFavorites ? 'No favorite tracks found' : 'No tracks found'}</li>
        )}
      </ul>
      {editIndex !== null && (
        <div className="edit-form mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Edit Track</h2>
          <input
            type="text"
            value={editedTrack.title}
            onChange={(e) => setEditedTrack({ ...editedTrack, title: e.target.value })}
            placeholder="Enter Song Title"
            className="mb-2 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          />
          <input
            type="text"
            value={editedTrack.artist}
            onChange={(e) => setEditedTrack({ ...editedTrack, artist: e.target.value })}
            placeholder="Enter Artist Name"
            className="mb-2 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          />
          <input
            type="text"
            value={editedTrack.url}
            onChange={(e) => setEditedTrack({ ...editedTrack, url: e.target.value })}
            placeholder="Enter YouTube Music Video URL"
            className="mb-2 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          />
          <button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Save
          </button>
          <button onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Playlist;
