import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
  url: string;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onProgress: (state: { played: number; playedSeconds: number }) => void;
}

export const YouTubePlayer = ({
  url,
  playing,
  onPlay,
  onPause,
  onProgress,
}: YouTubePlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Extract video ID from URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      const ytPlayer = new (window as any).YT.Player(iframeRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              onPlay();
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              onPause();
            }
          },
        },
      });
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId]);

  // Control playback
  useEffect(() => {
    if (!player) return;

    if (playing) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [playing, player]);

  // Track progress
  useEffect(() => {
    if (!player) return;

    if (playing) {
      intervalRef.current = setInterval(() => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        
        if (duration > 0) {
          const played = currentTime / duration;
          onProgress({
            played,
            playedSeconds: currentTime,
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playing, player, onProgress]);

  return (
    <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
      <div
        ref={iframeRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
