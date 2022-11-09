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
import {tSourceLanguage} from "./App";
import {muteMicrophoneContinueTranscribe} from "./TranscribeClient";
import MicrophoneStream from "microphone-stream";
import {TranscribeStreamingClient} from "@aws-sdk/client-transcribe-streaming";
Amplify.configure(awsExports);

interface tMeeetingControlBarInput {
  transcribeStatus: boolean,
  setTranscribeStatus: (a: boolean) => void,
  setSourceLanguage: (a: string) => void,
  sourceLanguages: tSourceLanguage[],
  setLocalMute: (a: boolean) => void,
  microphoneStream: MicrophoneStream,
  transcriptionClient:TranscribeStreamingClient,
}

const MeetingControlBar = (props: tMeeetingControlBarInput) => {
  const [meetingId, setMeetingId] = useState('');
  const [requestId, setRequestId] = useState('');
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const { muted, toggleMute } = useToggleLocalMute();
  const [isLoading, setLoading] = useState(false);
  const [keepEmitting, setTranscribeEmit] = useState(false);
  const {
    transcribeStatus,
    setTranscribeStatus,
    setSourceLanguage,
    sourceLanguages,
    setLocalMute,
    microphoneStream,
    transcriptionClient
  } = props;
  
  useEffect(() => {
    setLocalMute(muted);
    // Keep transcription but turn off voice input.
    muteMicrophoneContinueTranscribe(microphoneStream, transcriptionClient)
  }, [toggleMute]);

  useEffect(() => {
    const SECONDS_MS = 14*1000;
    if(muted) {
      const interval = setInterval(() => {
        console.error('Logs every 14 seconds');
        // TODO(): Send empty string to keep stream alive in audiostream?
        /**
         * const command = new StartStreamTranscriptionCommand({
         *   // The language code for the input audio. Valid values are en-GB, en-US, es-US, fr-CA, and fr-FR
         *   LanguageCode: "en-US",
         *   // The encoding used for the input audio. The only valid value is pcm.
         *   MediaEncoding: "pcm",
         *   // The sample rate of the input audio in Hertz. We suggest that you use 8000 Hz for low-quality audio and 16000 Hz for
         *   // high-quality audio. The sample rate must match the sample rate in the audio file.
         *   MediaSampleRateHertz: 44100,
         *   AudioStream: audioStream(),
         * });
         * const response = await client.send(command);
         */
      }, SECONDS_MS);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [toggleMute])


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
    popOver: sourceLanguages?.map((sourceLanguage) => ({
      onClick: () => setSourceLanguage(sourceLanguage.code),
      children: <span>{sourceLanguage.language}</span>,
    })),
    onClick: () => handleTranscribe(),
    label: 'Transcribe',
  };

  const handleLeave = async () => {
    await meetingManager.leave();
  };

  const handleEnd = async () => {
    console.log(`Auth ${JSON.stringify(await Auth.currentUserInfo())}`);
    try {
      await API.post('meetingApi', '/end', { body: { meetingId: meetingId } });
    } catch (err) {
      console.log(`{err in handleEnd: ${err}`);
    }
  };

  const handleJoin = async () => {
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

  const handleTranscribe = async () => {
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
