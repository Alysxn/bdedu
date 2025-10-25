import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  url: string;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onProgress: (state: { played: number; playedSeconds: number }) => void;
  onDuration: (duration: number) => void;
}

const Player = ReactPlayer as any;

export const YouTubePlayer = ({
  url,
  playing,
  onPlay,
  onPause,
  onProgress,
  onDuration,
}: YouTubePlayerProps) => {
  return (
    <Player
      url={url}
      width="100%"
      height="100%"
      playing={playing}
      controls
      onPlay={onPlay}
      onPause={onPause}
      onProgress={onProgress}
      onDuration={onDuration}
      progressInterval={1000}
    />
  );
};
