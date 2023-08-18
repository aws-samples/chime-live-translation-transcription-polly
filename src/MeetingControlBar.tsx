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
import { API, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import {Loader} from "@aws-amplify/ui-react";
import {muteMicrophoneContinueTranscribe} from "./TranscribeClient";
import {tMeetingControlBarInput, tSourceLanguage} from "./types";
const MeetingControlBar = (props: tMeetingControlBarInput) => {
  const [meetingId, setMeetingId] = useState('');
  const [requestId, setRequestId] = useState('');
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const { muted, toggleMute } = useToggleLocalMute();
  const [isLoading, setLoading] = useState(false);
  const {
    transcribeStatus,
    setTranscribeStatus,
    setSourceLanguage,
    sourceLanguages,
    setLocalMute,
    sourceLanguage,
    microphoneStream,
  } = props;

  useEffect(() => {
    setLocalMute(muted);
    // Keep transcription but turn off voice input.
    if(muted){
      muteMicrophoneContinueTranscribe(microphoneStream)
    }
  }, [toggleMute]);

  const JoinButtonProps = {
    icon: <Meeting />,
    onClick: () => handleJoin(),
    label: 'Join',
  };

  const LeaveButtonProps = {
    icon: <LeaveMeeting />,
    onClick: () => handleLeave(),
    label: 'Leave',
  };

  const EndButtonProps = {
    icon: <Remove />,
    onClick: () => handleEnd(),
    label: 'End',
  };

  const TranscribeButtonProps = {
    icon: transcribeStatus ? <Pause className={"pauseTranscription"}/> : <Record />,
    popOver: sourceLanguages?.map((srcLang) => {
      return ({
        onClick: () => setSourceLanguage(srcLang.code),
        children: <span>
                <img src={srcLang.icon} height='18'/>
                <span>{srcLang.language}
                  {srcLang.code === sourceLanguage && <span> - (Selected)</span>}
                </span>
            </span>,
      })
    }),
    onClick: () => handleTranscribe(),
    label: 'Transcribe',
  };

  const handleLeave = async () => {
    return await meetingManager.leave();
  };

  const handleEnd = async () => {
    // @ts-ignore
    console.log(`Auth ${JSON.stringify(await Auth.currentUserInfo())}`);
    try {
      return await API.post('meetingApi', '/end', { body: { meetingId: meetingId } });
    } catch (err) {
      console.log(`{err in handleEnd: ${err}`);
      return;
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    const email = (await Auth.currentUserInfo()).attributes.email;
    const name = (await Auth.currentUserInfo()).attributes.name;
    try {
      const attendeeCapabilities = {
        Audio: 'None',
        Content: 'SendReceive',
        Video: 'SendReceive',
      };
      const joinResponse = await API.post('meetingApi', '/create', {
        body: { name: name, email: email, requestId: requestId, attendeeCapabilities: attendeeCapabilities },
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
      setLoading(false);
      return DeviceLabels;
    } catch (err) {
      console.log(`err in handleJoin: ${err}`);
    }
  };

  const handleTranscribe = async () => {
    setTranscribeStatus(!transcribeStatus);
    return transcribeStatus;
  };

  return (
    <ControlBar
      showLabels={true}
      responsive={true}
      layout='undocked-horizontal'
    >
      <Input
        showClear={true}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestId(e.target.value)}
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
