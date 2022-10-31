import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useLocalVideo,
  useAudioVideo,
  VideoTileGrid,
  useMeetingStatus,
  MeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

const VideoMeeting = ({ setLine, setTranscribeStatus, setTranslateStatus }) => {
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();

  const audioVideo = useAudioVideo();

  useEffect(() => {
    async function tog() {
      if (meetingStatus === MeetingStatus.Succeeded) {
        await toggleVideo();
      }
      if (meetingStatus === MeetingStatus.Ended) {
        setLine([]);
        setTranscribeStatus(false);
        setTranslateStatus(false);
      }
    }
    tog();
  }, [meetingStatus]);

  useEffect(() => {
    if (!audioVideo) {
      console.log('No audioVideo');
      return;
    }
    console.log('Audio Video found');
    audioVideo.realtimeSubscribeToReceiveDataMessage('transcribe', (data) => {
      console.log(`realtimeData: ${JSON.stringify(data)}`);
      const receivedData = (data && data.json()) || {};
      const { message } = receivedData;
      console.log(`incomingTranscribeStatus: ${message}`);
      setTranscribeStatus(message);
    });

    return () => {
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage('Message');
    };
  }, [audioVideo]);

  return (
    <div style={{ height: '600px', width: '720px' }}>
      <VideoTileGrid />
    </div>
  );
};

export default VideoMeeting;
