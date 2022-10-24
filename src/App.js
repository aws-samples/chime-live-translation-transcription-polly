import React, { useState, useEffect } from 'react';
import './App.css';
import {
  useMeetingManager,
  // useMeetingEvent,
  useLocalVideo,
  useAudioVideo,
  ControlBar,
  ControlBarButton,
  Meeting,
  LeaveMeeting,
  AudioInputControl,
  Input,
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
import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

Amplify.Logger.LOG_LEVEL = 'DEBUG';

const App = () => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});
  // const meetingEvent = useMeetingEvent();
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const [meetingId, setMeetingId] = useState('');
  // const [attendeeId, setAttendeeId] = useState('');
  const [requestId, setRequestId] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  const [lines, setLine] = useState([]);
  const [transcribeStatus, setTranscribeStatus] = useState(false);
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
    async function tog() {
      if (meetingStatus === MeetingStatus.Succeeded) {
        await toggleVideo();
      }
      if (meetingStatus === MeetingStatus.Ended) {
        setLine([]);
        setTranscribeStatus(false);
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
    if (transcripts) {
      if (transcripts.results !== undefined) {
        if (!transcripts.results[0].isPartial) {
          if (
            transcripts.results[0].alternatives[0].items[0].confidence > 0.5
          ) {
            setLine((lines) => [
              ...lines,
              `${transcripts.results[0].alternatives[0].items[0].attendee.externalUserId}: ${transcripts.results[0].alternatives[0].transcript}`,
            ]);
          }
        }
      }
    }
  }, [transcripts]);

  useEffect(() => {
    console.log(`transcribeStatus: ${transcribeStatus}`);
    // console.log(`audioVideo: ${JSON.stringify(audioVideo)}`);
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
      // setAttendeeId(joinResponse.Attendee.AttendeeId);
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
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <SpaceBetween direction='horizontal' size='xs'>
          <SpaceBetween direction='vertical' size='l'>
            <Container
              header={<Header variant='h2'>Amazon Chime SDK Meeting</Header>}
            >
              <div style={{ height: '600px', width: '720px' }}>
                <VideoTileGrid />
              </div>
            </Container>
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
                style={{ marginLeft: '20px', marginRight: '20px' }}
              />
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
          </SpaceBetween>

          <Container header={<Header variant='h2'>Transcription</Header>}>
            <SpaceBetween size='xs'>
              <div style={{ height: '600px', width: '240px' }}>
                {lines
                  .slice(Math.max(lines.length - 10, 0))
                  .map((line, index) => (
                    <div key={index}>
                      {line}
                      <br />
                    </div>
                  ))}
              </div>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      )}
    </Authenticator>
  );
};

export default App;
