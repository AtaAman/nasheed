"use client"
import { useState } from 'react';
import usePlaylistStore from '../../stores/usePlaylistStore';
import { getVideoDetails } from '../../lib/youtubeApi'; 

const AddTrack = () => {
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const addTrack = usePlaylistStore((state) => state.addTrack);
  const setShouldPlayOnUpdate = usePlaylistStore((state) => state.setShouldPlayOnUpdate);

  const handleAddTrack = async () => {
    const youtubeId = extractYouTubeId(url);
    if (youtubeId && title && artist) {
      try {
        setShouldPlayOnUpdate(false); // Prevent auto-play
        const thumbnail = await getVideoDetails(youtubeId);
        await addTrack({
            youtubeId,
            title,
            artist,
            thumbnail,
            favorite: false
        });
        setTitle('');
        setArtist('');
        setUrl('');
      } catch (error) {
        console.error('Failed to add track:', error);
      }
    } else {
      console.error('Invalid input data:', { youtubeId, title, artist, url });
    }
  };

  function extractYouTubeId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|e\/|watch\?v=|embed\/|user\/\S+\/|playlist\?list=))|(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  return (
    <div className='flex justify-center'>
          <div className="add-track flex  text-white w-[90%] items-center md:w-[60%] bg-[#141414]/80 m-10 p-10 rounded-lg flex-col mt-6">
      <h1 className='text-2xl font-bold mb-5'>Add Nasheeds</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Song Title"
        className="mb-2 p-2 border bg-black border-gray-300 rounded-lg shadow-sm w-full max-w-md"
      />
      <input
        type="text"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Enter Artist Name"
        className="mb-2 p-2 border bg-black border-gray-300 rounded-lg shadow-sm w-full max-w-md"
      />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube Music Video URL"
        className="mb-2 p-2 border bg-black border-gray-300 rounded-lg shadow-sm w-full max-w-md"
      />
      <button onClick={handleAddTrack} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Add to Nasheed
      </button>
    </div>
    </div>
  );
};

export default AddTrack;
