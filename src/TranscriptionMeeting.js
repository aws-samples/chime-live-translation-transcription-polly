import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useMeetingManager,
  useLocalVideo,
  useAudioVideo,
  ControlBar,
  ControlBarButton,
  Meeting,
  LeaveMeeting,
  AudioInputControl,
  Input,
  Attendees,
  DeviceLabels,
  VideoTileGrid,
  Record,
  Pause,
  Remove,
  VideoInputControl,
  AudioOutputControl,
  useMeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import {
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';
import { Amplify, API, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const languages = [
  { language: 'Arabic', code: 'ar' },
  { language: 'Chinese (Simplified)', code: 'zh' },
  { language: 'English', code: 'en' },
  { language: 'French (Canada)', code: 'fr-CA' },
  { language: 'Hebrew', code: 'he' },
  { language: 'Hindi', code: 'hi' },
  { language: 'Japanese', code: 'ja' },
  { language: 'Portuguese (Brazil)', code: 'pt' },
  { language: 'Spanish (Mexico)', code: 'es-MX' },
];

const TranscriptionMeeting = () => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const [meetingId, setMeetingId] = useState('');
  const [requestId, setRequestId] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  const [lines, setLine] = useState([]);
  const [transcribeStatus, setTranscribeStatus] = useState(false);
  const [translateStatus, setTranslateStatus] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');
  const audioVideo = useAudioVideo();

  const { toggleVideo } = useLocalVideo();

  useEffect(() => {
    async function getAuth() {
      setCurrentSession(await Auth.currentSession());
      setCurrentCredentials(await Auth.currentUserCredentials());
      console.log(`authState: ${JSON.stringify(currentSession)}`);
      console.log(`currentCredentials: ${JSON.stringify(currentCredentials)}`);
    }
    getAuth();
  }, []);

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

  const handleLeave = async (event) => {
    await meetingManager.leave();
  };

  const handleEnd = async (event) => {
    console.log(`Auth ${JSON.stringify(await Auth.currentUserInfo())}`);
    event.preventDefault();
    try {
      await API.post('meetingApi', '/end', { body: { meetingId: meetingId } });
    } catch (err) {
      console.log(`{err in handleEnd: ${err}`);
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    const email = (await Auth.currentUserInfo()).attributes.email;
    const name = (await Auth.currentUserInfo()).attributes.name;
    try {
      const joinResponse = await API.post('meetingApi', '/create', {
        body: { name: name, email: email, requestId: requestId },
      });
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        joinResponse.Meeting,
        joinResponse.Attendee,
      );

      const options = {
        deviceLabels: DeviceLabels.AudioAndVideo,
      };

      await meetingManager.join(meetingSessionConfiguration, options);
      await meetingManager.start();
      meetingManager.invokeDeviceProvider(DeviceLabels.AudioAndVideo);
      setMeetingId(joinResponse.Meeting.MeetingId);
    } catch (err) {
      console.log(`err in handleJoin: ${err}`);
    }
  };

  return (
    <SpaceBetween direction='horizontal' size='xs'>
      <SpaceBetween direction='vertical' size='l'>
        <div style={{ height: '600px', width: '720px' }}>
          <VideoTileGrid />
        </div>
      </SpaceBetween>
    </SpaceBetween>
  );
};

export default TranscriptionMeeting;
