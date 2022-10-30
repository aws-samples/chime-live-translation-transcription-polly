import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useAudioVideo,
  useMeetingManager,
  useMeetingStatus,
  useLocalVideo,
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
  MeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { Amplify, API, Auth } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const MeetingControlBar = ({
  transcribeStatus,
  setTranscribeStatus,
  setSourceLanguage,
  sourceLanguages,
  sourceLanguage,
  translateStatus,
  setTranslateStatus,
}) => {
  const [meetingId, setMeetingId] = useState('');
  const [requestId, setRequestId] = useState('');
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();

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
    icon: transcribeStatus ? <Pause /> : <Record />,
    popOver: sourceLanguages?.map((sourceLanguage) => ({
      onClick: () => setSourceLanguage(sourceLanguage.code),
      children: <span>{sourceLanguage.language}</span>,
    })),
    onClick: (event) => handleTranscribe(event),
    label: 'Transcribe',
  };

  const TranslateButtonProps = {
    icon: translateStatus ? <Pause /> : <Attendees />,
    onClick: (event) => setTranslateStatus(!translateStatus),
    label: 'Translate',
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

  const handleTranscribe = async (event) => {
    event.preventDefault();
    try {
      const transcribeResponse = await API.post('meetingApi', '/transcribe', {
        body: {
          action: !transcribeStatus,
          meetingId: meetingId,
          sourceLanguage: sourceLanguage || 'en-US',
        },
      });
      setTranscribeStatus(!transcribeStatus);
      console.log(`Sending message: ${JSON.stringify(!transcribeStatus)}`);
      audioVideo.realtimeSendDataMessage(
        'transcribe',
        { message: !transcribeStatus },
        30000,
      );
      console.log(`transcribeResponse: ${transcribeResponse}`);
    } catch (err) {
      console.log(`err in handleTranscribe: ${err}`);
    }
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

      {!audioVideo && <ControlBarButton {...JoinButtonProps} />}
      {audioVideo && (
        <>
          <ControlBarButton {...LeaveButtonProps} />
          <ControlBarButton {...EndButtonProps} />
          <ControlBarButton {...TranscribeButtonProps} />
          <ControlBarButton {...TranslateButtonProps} />
          <AudioInputControl />
          <AudioOutputControl />
          <VideoInputControl />
        </>
      )}
    </ControlBar>
  );
};

export default MeetingControlBar;
