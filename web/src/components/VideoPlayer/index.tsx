import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import RenderIf from "components/RenderIf";

const VideoPlayer = () => {
  const [renderVideo, setRenderVideo] = useState(false);

  useEffect(() => {
    if (window) {
      setRenderVideo(true);
    }
  }, []);

  return (
    <RenderIf condition={renderVideo}>
      <ReactPlayer
        controls
        width="100%"
        height="100%"
        url="https://www.youtube.com/watch?v=wrj5JzYAptU&ab_channel=30SecondExplainerVideos"
      />
    </RenderIf>
  );
};

export default VideoPlayer;
