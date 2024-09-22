import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function getVideoDetails(youtubeId: string) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: youtubeId,
        key: API_KEY,
      },
    });
    const video = response.data.items[0]; 
    return video?.snippet?.thumbnails?.high?.url || '';
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}

