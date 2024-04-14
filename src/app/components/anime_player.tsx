'use client';
import { useCallback, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

/*
 This component is used to display a video
*/

// These values allow the video to fit the screen
const WIDTH = 1024;
const HEIGHT = 576;

type AnimePlayer = {
  videoPath: string;
};

export default function AnimePlayer({ videoPath }: AnimePlayer) {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const onVideo = useCallback((el: HTMLVideoElement) => {
    setVideoEl(el);
  }, []);
  useEffect(() => {
    if (videoEl) {
      const player = videojs(videoEl, {
        html5: {
          vhs: {
            experimentalBufferBasedABR: true,
          },
        },
        autoplay: false,
        controls: true,
        preload: 'auto',
        sources: [
          {
            src: videoPath,
            type: 'video/mp4',
          },
        ],
        width: WIDTH,
        height: HEIGHT,
      });
      return () => {
        player.dispose();
      };
    }
  }, [videoEl, videoPath]);
  return (
    <div data-vjs-player>
      <video
        ref={onVideo}
        className="video-js vjs-default-skin vjs-big-play-centered"
        playsInline
      ></video>
    </div>
  );
}
