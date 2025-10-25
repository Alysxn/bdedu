import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  url: string;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onProgress: (state: { played: number; playedSeconds: number }) => void;
}

// Cast ReactPlayer to any to avoid type conflicts with HTML video element
const Player = ReactPlayer as any;

export const YouTubePlayer = ({
  url,
  playing,
  onPlay,
  onPause,
  onProgress,
}: YouTubePlayerProps) => {
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
      <Player
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        controls={true}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        progressInterval={1000}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};
