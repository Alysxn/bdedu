/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Get YouTube thumbnail URL from video URL or ID
 * Uses high quality (hqdefault) format
 */
export const getYouTubeThumbnail = (videoUrl: string): string | null => {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
