import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
    return (
        <>
            <ReactPlayer
                controls
                width="100%"
                height="100%"
                url="https://www.youtube.com/watch?v=wrj5JzYAptU&ab_channel=30SecondExplainerVideos"
            />
        </>
    )
}

export default VideoPlayer;
