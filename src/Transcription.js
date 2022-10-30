import React, { useState, useEffect } from 'react';
import './App.css';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { Amplify, API, Auth } from 'aws-amplify';
import Predictions, {
  AmazonAIPredictionsProvider,
} from '@aws-amplify/predictions';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const Transcription = ({
  transcribeStatus,
  setTranscribeStatus,
  setSourceLanguage,
  sourceLanguages,
  sourceLanguage,
  targetLanguage,
  translateStatus,
  setTranslateStatus,
  setTranscripts,
  setLine,
  transcripts,
  lines,
}) => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});

  const audioVideo = useAudioVideo();

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

  return (
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
  );
};

export default Transcription;
