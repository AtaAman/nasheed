"use client";
import { useState } from "react";
import usePlaylistStore from "../../stores/usePlaylistStore";
import { getVideoDetails } from "../../lib/youtubeApi"; 
import { extractYouTubeId } from "@/utils/ExtractedYoutubeId";
import { useRouter } from "next/navigation";

const AddTrack = () => {
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);
  const addTrack = usePlaylistStore((state) => state.addTrack);
  const setShouldPlayOnUpdate = usePlaylistStore((state) => state.setShouldPlayOnUpdate);
  const router = useRouter();

  const handleAddTrack = async () => {
    const youtubeId = extractYouTubeId(url);
    if (youtubeId && title && artist) {
      setWarning(null);
      try {
        setShouldPlayOnUpdate(false);
        setLoading(true);
        const thumbnail = await getVideoDetails(youtubeId);
        addTrack({
          youtubeId,
          title,
          artist,
          thumbnail,
          favorite: false,
        });
        setTitle("");
        setArtist("");
        setUrl("");
        router.push("/nasheed");
      } catch (error) {
        console.error("Failed to add track:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setWarning("Please fill in all fields."); 
      console.error("Invalid input data:", { youtubeId, title, artist, url });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="add-track flex text-white w-[90%] items-center md:w-[60%] bg-[#141414]/80 m-10 p-10 rounded-lg flex-col mt-6">
        <h1 className="text-2xl font-bold mb-5">Add Nasheeds</h1>
        {warning && <p className="text-red-500 mb-2">{warning}</p>} 
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
        <button
          onClick={handleAddTrack}
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Nasheed'}
        </button>
      </div>
    </div>
  );
};

export default AddTrack;
