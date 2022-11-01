import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { Amplify } from 'aws-amplify';
import Predictions, {
  AmazonAIPredictionsProvider,
} from '@aws-amplify/predictions';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const Transcription = ({ targetLanguage, setLine, transcripts, lines }) => {
  const audioVideo = useAudioVideo();
  const [incomingTranscripts, setIncomingTranscripts] = useState([]);

  useEffect(() => {
    async function transcribeText() {
      console.log(`transcripts: ${transcripts}`);
      if (transcripts.transcriptEvent) {
        if (transcripts.transcriptEvent.results !== undefined) {
          if (!transcripts.transcriptEvent.results[0].isPartial) {
            if (
              transcripts.transcriptEvent.results[0].alternatives[0].items[0]
                .confidence > 0.5
            ) {
              console.log(`sourceLanguage: ${transcripts.sourceLanguage}`);
              console.log(`targetLanguage: ${targetLanguage}`);
              if (transcripts.sourceLanguage != targetLanguage) {
                var translateResult = await Predictions.convert({
                  translateText: {
                    source: {
                      text: transcripts.transcriptEvent.results[0]
                        .alternatives[0].transcript,
                      language: transcripts.sourceLanguage,
                    },
                    targetLanguage: targetLanguage,
                  },
                });
                console.log(
                  `translateResult: ${JSON.stringify(translateResult.text)}`,
                );
                setLine((lines) => [
                  ...lines,
                  `${transcript.attendeeName}: ${translateResult.text}`,
                ]);
              } else {
                setLine((lines) => [
                  ...lines,
                  `${transcripts.attendeeName}: ${transcripts.transcriptEvent.results[0].alternatives[0].transcript}`,
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
    async function transcribeText() {
      console.log(`incomingTranscripts: ${incomingTranscripts}`);
      if (incomingTranscripts.transcriptEvent) {
        if (incomingTranscripts.transcriptEvent.results !== undefined) {
          if (!incomingTranscripts.transcriptEvent.results[0].isPartial) {
            if (
              incomingTranscripts.transcriptEvent.results[0].alternatives[0]
                .items[0].confidence > 0.5
            ) {
              console.log(
                `sourceLanguage: ${incomingTranscripts.sourceLanguage}`,
              );
              console.log(`targetLanguage: ${targetLanguage}`);
              if (incomingTranscripts.sourceLanguage != targetLanguage) {
                var translateResult = await Predictions.convert({
                  translateText: {
                    source: {
                      text: incomingTranscripts.transcriptEvent.results[0]
                        .alternatives[0].transcript,
                      language: incomingTranscripts.sourceLanguage,
                    },
                    targetLanguage: targetLanguage,
                  },
                });
                console.log(
                  `translateResult: ${JSON.stringify(translateResult.text)}`,
                );
                setLine((lines) => [
                  ...lines,
                  `${transcripts.attendeeName}: ${translateResult.text}`,
                ]);
              } else {
                setLine((lines) => [
                  ...lines,
                  `${incomingTranscripts.attendeeName}: ${incomingTranscripts.transcriptEvent.results[0].alternatives[0].transcript}`,
                ]);
              }
            }
          }
        }
      }
    }
    transcribeText();
  }, [incomingTranscripts]);

  useEffect(() => {
    if (!audioVideo) {
      console.log('No audioVideo');
      return;
    }
    if (transcripts) {
      if (transcripts.transcriptEvent.results !== undefined) {
        if (!transcripts.transcriptEvent.results[0].isPartial) {
          console.log(
            `Sending transcriptEvent: ${JSON.stringify(transcripts)}`,
          );
          audioVideo.realtimeSendDataMessage(
            'transcriptEvent',
            { message: transcripts },
            30000,
          );
        }
      }
    }
  }, [transcripts]);

  useEffect(() => {
    if (!audioVideo) {
      console.log('No audioVideo');
      return;
    }
    console.log('Audio Video found');
    audioVideo.realtimeSubscribeToReceiveDataMessage(
      'transcriptEvent',
      (data) => {
        console.log(`realtimeData: ${JSON.stringify(data)}`);
        const receivedData = (data && data.json()) || {};
        const { message } = receivedData;
        console.log(`incomingTranscriptEvent: ${message}`);
        setIncomingTranscripts(message);
      },
    );

    return () => {
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage('Message');
    };
  }, [audioVideo]);

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
