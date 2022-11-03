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

const Transcription = ({ targetLanguage, setLine, transcripts, lines }) => {
  const audioVideo = useAudioVideo();
  const [incomingTranscripts, setIncomingTranscripts] = useState([]);
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    async function transcribeText() {
      console.log(`transcripts: ${JSON.stringify(transcripts)}`);
      if (transcripts.transcriptEvent) {
        console.log('transcripts.transcriptEvent');
        // if (transcripts.transcriptEvent.results !== undefined) {
        //   console.log('transcripts.transcriptEvent.results !== undefined');
        //   if (!transcripts.transcriptEvent.results[0].isPartial) {
        //     if (
        //       transcripts.transcriptEvent.results[0].alternatives[0].items[0]
        //         .confidence > 0.5
        //     ) {
        // console.log(`sourceLanguage: ${transcripts.sourceLanguage}`);
        // console.log(`targetLanguage: ${targetLanguage}`);
        // if (transcripts.sourceLanguage != targetLanguage) {
        //   var translateResult = await Predictions.convert({
        //     translateText: {
        //       source: {
        //         text: transcripts.transcriptEvent,
        //         language: transcripts.sourceLanguage,
        //       },
        //       targetLanguage: targetLanguage,
        //     },
        //   });
        //   console.log(
        //     `translateResult: ${JSON.stringify(translateResult.text)}`,
        //   );
        //   setLine((lines) => [
        //     ...lines,
        //     `${transcript.attendeeName}: ${translateResult.text}`,
        //   ]);
        // } else {
        if (transcripts.partial) {
          setCurrentLine(
            `${transcripts.attendeeName}: ${transcripts.transcriptEvent}`,
          );
        } else {
          setLine((lines) => [
            ...lines,
            `${transcripts.attendeeName}: ${transcripts.transcriptEvent}`,
          ]);
          setCurrentLine('');
        }
        // }
      }
      //     }
      //   }
      // }
    }
    transcribeText();
  }, [transcripts]);

  useEffect(() => {
    async function transcribeText() {
      console.log(
        `incomingTranscripts: ${JSON.stringify(incomingTranscripts)}`,
      );
      if (incomingTranscripts.transcriptEvent) {
        // if (incomingTranscripts.transcriptEvent.results !== undefined) {
        //   if (!incomingTranscripts.transcriptEvent.results[0].isPartial) {
        //     if (
        //       incomingTranscripts.transcriptEvent.results[0].alternatives[0]
        //         .items[0].confidence > 0.5
        //     ) {
        console.log(`sourceLanguage: ${incomingTranscripts.sourceLanguage}`);
        console.log(`targetLanguage: ${targetLanguage}`);

        if (incomingTranscripts.sourceLanguage != targetLanguage) {
          var translateResult = await Predictions.convert({
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

          if (incomingTranscripts.partial) {
            console.log('partial');
            setCurrentLine(
              `${incomingTranscripts.attendeeName}: ${translateResult.text}`,
            );
          } else {
            setLine((lines) => [
              ...lines,
              `${incomingTranscripts.attendeeName}: ${translateResult.text}`,
            ]);
            setCurrentLine('');
          }
        } else {
          if (incomingTranscripts.partial) {
            console.log('partial');
            setCurrentLine(
              `${incomingTranscripts.attendeeName}: ${incomingTranscripts.transcriptEvent}`,
            );
          } else {
            setLine((lines) => [
              ...lines,
              `${incomingTranscripts.attendeeName}: ${incomingTranscripts.transcriptEvent}`,
            ]);
            setCurrentLine('');
          }
        }
        //     }
        //   }
        // }
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
      // if (transcripts.transcriptEvent.results !== undefined) {
      //   if (!transcripts.transcriptEvent.results[0].isPartial) {
      console.log(`Sending transcriptEvent: ${JSON.stringify(transcripts)}`);
      audioVideo.realtimeSendDataMessage(
        'transcriptEvent',
        { message: transcripts },
        30000,
      );
      //   }
      // }
    }
  }, [transcripts]);

  useEffect(() => {
    if (!audioVideo) {
      console.log('No audioVideo');
      return;
    }
    console.log('Audio Video found - receive transcriptEvent messages');
    audioVideo.realtimeSubscribeToReceiveDataMessage(
      'transcriptEvent',
      (data) => {
        // console.log(`realtimeData: ${JSON.stringify(data)}`);
        const receivedData = (data && data.json()) || {};
        const { message } = receivedData;
        console.log(`incomingTranscriptEvent: ${message}`);
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
