import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useMeetingManager,
  useLocalVideo,
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
  sourceLanguage = 'en-US',
  transcripts,
  setTranscripts,
  lines,
  setLine,
}) => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const [transcribeMeetingId, setTranscribeMeetingId] = useState('');
  const [requestId, setRequestId] = useState('');
  // const [transcripts, setTranscripts] = useState([]);
  // const [lines, setLine] = useState([]);
  const [translateStatus, setTranslateStatus] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');
  // const [sourceLanguage, setSourceLanguage] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
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
    console.log(`transcribeMeeting useEffect: ${transcribeStatus}`);
    async function joinMeeting() {
      const email = (await Auth.currentUserInfo()).attributes.email;
      const name = (await Auth.currentUserInfo()).attributes.name;
      setAttendeeName(name);
      try {
        const joinResponse = await API.post('meetingApi', '/create', {
          body: {
            name: name,
            email: email,
            requestId: requestId,
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
        console.log(transcribeResponse);
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
    } else {
      endMeeting();
    }
  }, [transcribeStatus]);

  useEffect(() => {
    async function subscribeToTranscribe() {
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
    }
    if (audioVideo) subscribeToTranscribe();
  }, [audioVideo]);

  // useEffect(() => {
  //   console.log(transcripts);
  //   async function transcribeText() {
  //     if (transcripts) {
  //       if (transcripts.results !== undefined) {
  //         if (!transcripts.results[0].isPartial) {
  //           if (
  //             transcripts.results[0].alternatives[0].items[0].confidence > 0.5
  //           ) {
  //             if (translateStatus) {
  //               var translateResult = await Predictions.convert({
  //                 translateText: {
  //                   source: {
  //                     text: transcripts.results[0].alternatives[0].transcript,
  //                     language: transcripts.results[0].languageCode,
  //                   },
  //                   targetLanguage: targetLanguage,
  //                 },
  //               });
  //               console.log(
  //                 `translateResult: ${JSON.stringify(translateResult.text)}`,
  //               );
  //               setLine((lines) => [
  //                 ...lines,
  //                 `${transcripts.results[0].alternatives[0].items[0].attendee.externalUserId}: ${translateResult.text}`,
  //               ]);
  //             } else {
  //               setLine((lines) => [
  //                 ...lines,
  //                 `${transcripts.results[0].alternatives[0].items[0].attendee.externalUserId}: ${transcripts.results[0].alternatives[0].transcript}`,
  //               ]);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   transcribeText();
  // }, [transcripts]);

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
