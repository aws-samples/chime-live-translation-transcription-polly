import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useMeetingManager,
  MeetingStatus,
  useToggleLocalMute,
  useAudioVideo,
  DeviceLabels,
  VideoTileGrid,
  useMeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import { SpaceBetween } from '@cloudscape-design/components';
import { Amplify, API, Auth } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const TranscriptionMeeting = ({
  transcribeStatus,
  sourceLanguage,
  setTranscripts,
  localMute,
}) => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});
  const meetingManager = useMeetingManager();
  const [transcribeMeetingId, setTranscribeMeetingId] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const audioVideo = useAudioVideo();
  const { muted, toggleMute } = useToggleLocalMute();
  const meetingStatus = useMeetingStatus();

  useEffect(() => {
    async function getAuth() {
      setCurrentSession(await Auth.currentSession());
      setCurrentCredentials(await Auth.currentUserCredentials());
    }
    getAuth();
  }, []);

  useEffect(() => {
    toggleMute();
  }, [localMute]);

  useEffect(() => {
    console.log(`transcribeMeeting transcribeStatus: ${transcribeStatus}`);
    async function joinMeeting() {
      const email = (await Auth.currentUserInfo()).attributes.email;
      const name = (await Auth.currentUserInfo()).attributes.name;
      setAttendeeName(name);
      try {
        const joinResponse = await API.post('meetingApi', '/create', {
          body: {
            name: name,
            email: email,
            requestId: '',
            attendeeCapabilities: {
              Audio: 'Send',
              Content: 'None',
              Video: 'None',
            },
          },
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
        console.log(`meetingId in join: ${joinResponse.Meeting.MeetingId}`);
        meetingManager.invokeDeviceProvider(DeviceLabels.AudioAndVideo);
        setTranscribeMeetingId(joinResponse.Meeting.MeetingId);

        const transcribeResponse = await API.post('meetingApi', '/transcribe', {
          body: {
            action: transcribeStatus,
            meetingId: joinResponse.Meeting.MeetingId,
            sourceLanguage: sourceLanguage || 'en-US',
          },
        });
        console.log(`transcribeResponse: ${transcribeResponse}`);
      } catch (err) {
        console.log(err);
      }
    }

    async function endMeeting() {
      try {
        await API.post('meetingApi', '/end', {
          body: { meetingId: transcribeMeetingId },
        });
      } catch (err) {
        console.log(`{err in handleEnd: ${err}`);
      }
    }

    if (transcribeStatus) {
      joinMeeting();
    } else if (meetingStatus === MeetingStatus.Succeeded) {
      endMeeting();
    }
  }, [transcribeStatus]);

  useEffect(() => {
    if (!audioVideo) {
      console.log('No audioVideo - transcribe');
      return;
    }
    console.log('Audio Video found');

    console.log('Subscribing to transcribe');
    audioVideo.transcriptionController.subscribeToTranscriptEvent(
      (transcriptEvent) => {
        setTranscripts({
          sourceLanguage: sourceLanguage,
          attendeeName: attendeeName,
          transcriptEvent: transcriptEvent,
        });
      },
    );

    return () => {
      audioVideo.transcriptionController.unsubscribeFromTranscriptEvent();
    };
  }, [audioVideo]);

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
