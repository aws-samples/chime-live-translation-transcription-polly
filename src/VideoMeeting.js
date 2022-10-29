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
  MeetingStatus,
  useMeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { Amplify, API, Auth } from 'aws-amplify';
import Predictions, {
  AmazonAIPredictionsProvider,
} from '@aws-amplify/predictions';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import awsExports from './aws-exports';
Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

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

const VideoMeeting = () => {
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

  useEffect(() => {
    console.log(transcripts);
    async function transcribeText() {
      if (transcripts) {
        if (transcripts.results !== undefined) {
          if (!transcripts.results[0].isPartial) {
            if (
              transcripts.results[0].alternatives[0].items[0].confidence > 0.5
            ) {
              if (translateStatus) {
                var translateResult = await Predictions.convert({
                  translateText: {
                    source: {
                      text: transcripts.results[0].alternatives[0].transcript,
                      language: transcripts.results[0].languageCode,
                    },
                    targetLanguage: targetLanguage,
                  },
                });
                console.log(
                  `translateResult: ${JSON.stringify(translateResult.text)}`,
                );
                setLine((lines) => [
                  ...lines,
                  `${transcripts.results[0].alternatives[0].items[0].attendee.externalUserId}: ${translateResult.text}`,
                ]);
              } else {
                setLine((lines) => [
                  ...lines,
                  `${transcripts.results[0].alternatives[0].items[0].attendee.externalUserId}: ${transcripts.results[0].alternatives[0].transcript}`,
                ]);
              }
            }
          }
        }
      }
    }
    transcribeText();
  }, [transcripts]);

  useEffect(() => {
    console.log(`transcribeStatus: ${transcribeStatus}`);
    if (transcribeStatus) {
      console.log('Subscribing to transcribe');
      audioVideo.transcriptionController.subscribeToTranscriptEvent(
        (transcriptEvent) => {
          setTranscripts(transcriptEvent);
        },
      );
    }
  }, [transcribeStatus]);

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
    onClick: (event) => handleTranscribe(event),
    label: 'Transcribe',
  };

  const TranslateButtonProps = {
    icon: translateStatus ? <Pause /> : <Attendees />,
    popOver: languages.map((language) => ({
      onClick: () => setTargetLanguage(language.code),
      children: <span>{language.language}</span>,
    })),

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
        body: { action: !transcribeStatus, meetingId: meetingId },
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
    <SpaceBetween direction='horizontal' size='xs'>
      <SpaceBetween direction='vertical' size='l'>
        <Container
          className='MeetingContainer'
          footer={
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
          }
        >
          <div style={{ height: '600px', width: '720px' }}>
            <VideoTileGrid />
          </div>
        </Container>
      </SpaceBetween>

      <Container header={<Header variant='h2'>Transcription</Header>}>
        <SpaceBetween size='xs'>
          <div style={{ height: '663px', width: '240px' }}>
            {lines.slice(Math.max(lines.length - 10, 0)).map((line, index) => (
              <div key={index}>
                {line}
                <br />
              </div>
            ))}
          </div>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default VideoMeeting;
