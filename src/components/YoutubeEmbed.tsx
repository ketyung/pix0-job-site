import React from 'react';
import YouTube from 'react-youtube';

type props ={
    videoId : string,

    width? : string,

    height? : string, 
}

const YouTubeEmbed = ({ videoId, width, height }: props) => {
  return (
    <YouTube
      videoId={videoId}
      opts={{
        width: width ?? '560',
        height: height ?? '315',
        playerVars: {
          autoplay: 0, // 0 for false, 1 for true
          controls: 1, // 0 for hide, 1 for show
          modestbranding: 1, // 0 for show YouTube logo, 1 for hide
          rel: 0, // 0 for hide related videos at the end, 1 for show
          fs: 1, // 0 for disable fullscreen button, 1 for show
          iv_load_policy: 3, // 1 for show video annotations, 3 for hide
          cc_load_policy: 0, // 1 for show closed captions, 0 for hide
          playsinline: 1 // 0 for disable picture-in-picture, 1 for enable
        }
      }}
    />
  );
};

export default YouTubeEmbed;
