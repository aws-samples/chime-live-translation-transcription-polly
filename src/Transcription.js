import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { Amplify } from 'aws-amplify';
import Predictions from '@aws-amplify/predictions';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const handlePartialTranscripts = (incomingTranscripts, outputText, setCurrentLine, setLine) => {
  if (incomingTranscripts.partial) {
    // console.log('partial');
    // TODO(miketran): break this into a list of objects
    setCurrentLine(
        `${incomingTranscripts.attendeeName}: ${outputText}`,
    );
  } else {
    // TODO(miketran): break this into a list of objects

    setLine((lines) => [
      ...lines,
      `${incomingTranscripts.attendeeName}: ${outputText}`,
    ]);
    setCurrentLine('');
  }
}

const Transcription = ({ targetLanguage, setLine, transcripts, lines }) => {
  const audioVideo = useAudioVideo();
  const [incomingTranscripts, setIncomingTranscripts] = useState([]);
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    async function transcribeText() {
      // console.log(`transcripts: ${JSON.stringify(transcripts)}`);
      if (transcripts.transcriptEvent) {
        handlePartialTranscripts(incomingTranscripts,
            incomingTranscripts.transcriptEvent,
            setCurrentLine,
            setLine
        );
      }
    }
    transcribeText();
  }, [transcripts]);

  useEffect(() => {
    async function transcribeText() {
      console.log(
        `incomingTranscripts: ${JSON.stringify(incomingTranscripts)}`,
      );
      if (incomingTranscripts.transcriptEvent) {
        console.log(`sourceLanguage: ${incomingTranscripts.sourceLanguage}`);
        console.log(`targetLanguage: ${targetLanguage}`);

        if (incomingTranscripts.sourceLanguage !== targetLanguage) {
          const translateResult = await Predictions.convert({
            translateText: {
              source: {
                text: incomingTranscripts.transcriptEvent,
                language: incomingTranscripts.sourceLanguage,
              },
              targetLanguage: targetLanguage,
            },
          });
          console.log(
            `translateResult: ${JSON.stringify(translateResult.text)}`,
          );

          handlePartialTranscripts(incomingTranscripts,
              translateResult.text,
              setCurrentLine,
              setLine
          );
        } else {
          handlePartialTranscripts(incomingTranscripts,
              incomingTranscripts.transcriptEvent,
              setCurrentLine,
              setLine
          );
        }
      }
    }
    transcribeText();
  }, [incomingTranscripts]);

  useEffect(() => {
    if (!audioVideo) {
      console.error('No audioVideo');
      return;
    }
    if (transcripts) {
      // console.log(`Sending transcriptEvent: ${JSON.stringify(transcripts)}`);
      audioVideo.realtimeSendDataMessage(
        'transcriptEvent',
        { message: transcripts },
        30000,
      );
    }
  }, [transcripts]);

  useEffect(() => {
    if (!audioVideo) {
      console.error('No audioVideo');
      return;
    }
    // console.log('Audio Video found - receive transcriptEvent messages');
    audioVideo.realtimeSubscribeToReceiveDataMessage(
      'transcriptEvent',
      (data) => {
        const receivedData = (data && data.json()) || {};
        const { message } = receivedData;
        // console.log(`incomingTranscriptEvent: ${message}`);
        setIncomingTranscripts(message);
      },
    );

    return () => {
      console.log('unsubscribing from receive data message');
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage('Message');
    };
  }, [audioVideo]);

  return (
    <Container header={<Header variant='h2'>Transcription</Header>}>
      <SpaceBetween size='xs'>
        <div style={{ height: '663px', width: '240px' }}>
        {/* // TODO(miketran): break this into a list of objects*/}
          {lines.slice(Math.max(lines.length - 10, 0)).map((line, index) => (
            <div key={index}>
              {line}
              <br />
            </div>
          ))}
          {currentLine ?? currentLine}
        </div>
      </SpaceBetween>
    </Container>
  );
};

export default Transcription;
