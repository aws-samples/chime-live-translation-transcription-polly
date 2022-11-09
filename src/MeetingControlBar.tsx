import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useAudioVideo,
  useMeetingManager,
  useToggleLocalMute,
  ControlBar,
  ControlBarButton,
  Meeting,
  LeaveMeeting,
  AudioInputControl,
  Input,
  DeviceLabels,
  Record,
  Pause,
  Remove,
  VideoInputControl,
  AudioOutputControl,
} from 'amazon-chime-sdk-component-library-react';
import { Amplify, API, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import awsExports from './aws-exports';
import {Loader} from "@aws-amplify/ui-react";
Amplify.configure(awsExports);

const MeetingControlBar = ({
  transcribeStatus,
  setTranscribeStatus,
  setSourceLanguage,
  sourceLanguages,
  setLocalMute,
}) => {
  const [meetingId, setMeetingId] = useState('');
  const [requestId, setRequestId] = useState('');
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const { muted, toggleMute } = useToggleLocalMute();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLocalMute(muted);
// Turns off transcription.
    setTranscribeStatus(false);
  }, [toggleMute]);

  const JoinButtonProps = {
    icon: <Meeting />,
    onClick: (event) => handleJoin(event),
    label: 'Join',
  };

  const LeaveButtonProps = {
    icon: <LeaveMeeting />,
    onClick: (event) => handleLeave(event),
    label: 'Leave',
  };

  const EndButtonProps = {
    icon: <Remove />,
    onClick: (event) => handleEnd(event),
    label: 'End',
  };

  const TranscribeButtonProps = {
    icon: transcribeStatus ? <Pause className={"pauseTranscription"}/> : <Record />,
    popOver: sourceLanguages?.map((sourceLanguage) => ({
      onClick: () => setSourceLanguage(sourceLanguage.code),
      children: <span>{sourceLanguage.language}</span>,
    })),
    onClick: (event) => handleTranscribe(event),
    label: 'Transcribe',
  };

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
    setLoading(true);
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
      setLoading(false)
    } catch (err) {
      console.log(`err in handleJoin: ${err}`);
    }
  };

  const handleTranscribe = async (event) => {
    event.preventDefault();
    setTranscribeStatus(!transcribeStatus);
  };

  return (
    <ControlBar
      showLabels={true}
      responsive={true}
      layout='undocked-horizontal'
    >
      <Input
        showClear={true}
        onChange={(e) => setRequestId(e.target.value)}
        sizing={'md'}
        value={requestId}
        placeholder='Request ID'
        type='text'
      />
      {isLoading && <Loader/>}
      {!audioVideo && <ControlBarButton {...JoinButtonProps} />}
      {audioVideo && (
        <>
          <ControlBarButton {...LeaveButtonProps} />
          <ControlBarButton {...EndButtonProps} />
          <ControlBarButton {...TranscribeButtonProps} />
          <AudioInputControl />
          <AudioOutputControl />
          <VideoInputControl />
        </>
      )}
    </ControlBar>
  );
};

export default MeetingControlBar;
