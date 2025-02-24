import React, { useState } from 'react'
import { Thumbnail } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialog from './PlayerDialog';

function VideoList({ videoList }) {
  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState();

  const handleCloseDialog = () => {
    setOpenPlayerDialog(false);
  };

  return (
    <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
      {videoList?.map((video, index) => (
        <div key={index} className='cursor-pointer hover:scale-105 transition-all'
          onClick={() => { setOpenPlayerDialog(true); setVideoId(video?.id) }}>
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={250}
            compositionHeight={390}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            style={{
              borderRadius: 12
            }}
            inputProps={{
              ...video,
              setDurationInFrame: (v) => console.log(v)
            }}
          />
        </div>
      ))}
      <PlayerDialog playVideo={openPlayerDialog} videoId={videoId} onClose={handleCloseDialog} />
    </div>
  )
}

export default VideoList