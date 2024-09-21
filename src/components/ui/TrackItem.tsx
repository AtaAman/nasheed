import { FaHeart, FaEdit, FaTrash, FaPlay, FaPause } from "react-icons/fa";

interface TrackItemProps {
  track: {
    title: string;
    artist: string;
    thumbnail: string;
    youtubeId: string;
    favorite: boolean;
  };
  index: number;
  isPlaying: boolean;
  currentTrackIndex: number;
  hoverIndex: number | null;
  handlePlayTrack: (index: number) => void;
  handleToggleFavorite: (index: number) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  setHoverIndex: (index: number | null) => void;
}

const TrackItem = ({
  track,
  index,
  isPlaying,
  currentTrackIndex,
  hoverIndex,
  handlePlayTrack,
  handleToggleFavorite,
  handleEdit,
  handleDelete,
  setHoverIndex,
}: TrackItemProps) => {
  return (
    <li
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
          <h3 className="font-bold text-xl text-white">{track.title}</h3>
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
  );
};

export default TrackItem;
