import { useState } from "react";
import { getVideoDetails } from "@/lib/youtubeApi";
import { extractYouTubeId } from "@/utils/ExtractedYoutubeId";
import usePlaylistStore from "../../stores/usePlaylistStore";

interface EditTrackModalProps {
  editIndex: number | null;
  track: { title: string; artist: string; url: string };
  onClose: () => void;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({
  editIndex,
  track,
  onClose,
}) => {
  const { updateTrack } = usePlaylistStore();
  const [editedTrack, setEditedTrack] = useState(track);

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
          onClose();
        } catch (error) {
          console.error("Failed to get video details:", error);
        }
      } else {
        console.warn("Invalid YouTube URL");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/40 p-6 rounded-lg shadow-lg w-96 md:w-[50%] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Track</h2>
        <input
          type="text"
          value={editedTrack.title}
          onChange={(e) => setEditedTrack({ ...editedTrack, title: e.target.value })}
          placeholder="Enter Song Title"
          className="mb-3 p-3 border border-gray-300 rounded-lg shadow-sm w-full"
        />
        <input
          type="text"
          value={editedTrack.artist}
          onChange={(e) => setEditedTrack({ ...editedTrack, artist: e.target.value })}
          placeholder="Enter Artist Name"
          className="mb-3 p-3 border border-gray-300 rounded-lg shadow-sm w-full"
        />
        <input
          type="text"
          value={editedTrack.url}
          onChange={(e) => setEditedTrack({ ...editedTrack, url: e.target.value })}
          placeholder="Enter YouTube Music Video URL"
          className="mb-3 p-3 border border-gray-300 rounded-lg shadow-sm w-full"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 md:py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-black/70 hover:bg-black text-white font-bold py-1 md:py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTrackModal;
