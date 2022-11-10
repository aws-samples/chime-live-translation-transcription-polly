import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { Amplify } from 'aws-amplify';
import Predictions from '@aws-amplify/predictions';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import awsExports from './aws-exports';
import {DataMessage} from "amazon-chime-sdk-js";
import {tIncomingTranscripts} from "./App";
Amplify.configure(awsExports);


interface tTranscriptionInput {
  targetLanguage: string;
  setLine: (a: tIncomingTranscripts[]) => void;
  transcripts: tIncomingTranscripts;
  lines: tIncomingTranscripts[];
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => {
    if(elementRef && elementRef.current){
      // @ts-ignore
      return elementRef?.current?.scrollIntoView();
    }
  });
  return <div ref={elementRef} />;
};

const handlePartialTranscripts = (
    incomingTranscripts: tIncomingTranscripts,
    outputText: string,
    setCurrentLine: (a: tIncomingTranscripts[]) => void,
    setLine: any
) => {
  const newTranscriptObject: tIncomingTranscripts = {
    attendeeName: `${incomingTranscripts.attendeeName}`,
    text: `${outputText}`
  };
  if (incomingTranscripts.partial) {
    // console.log('partial');
    setCurrentLine([newTranscriptObject]);
  } else {
    setLine((lines: tIncomingTranscripts[]) => [
      ...lines,
      newTranscriptObject,
    ]);
    setCurrentLine([]);
  }
}

const Transcription = (props: tTranscriptionInput) => {
  const { targetLanguage, setLine, transcripts, lines } = props;
  const audioVideo = useAudioVideo();
  const [incomingTranscripts, setIncomingTranscripts] = useState<tIncomingTranscripts>();
  const [currentLine, setCurrentLine] = useState<tIncomingTranscripts[]>([]);

  useEffect(() => {
    async function transcribeText() {
      if (transcripts && transcripts.transcriptEvent) {
        console.log(transcripts, "??")
        handlePartialTranscripts(
            transcripts,
            transcripts.transcriptEvent,
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
      if (incomingTranscripts?.transcriptEvent) {
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

          handlePartialTranscripts(
              incomingTranscripts,
              translateResult.text,
              setCurrentLine,
              setLine
          );
        } else {
          handlePartialTranscripts(
              incomingTranscripts,
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
      (data: DataMessage) => {
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
        <div style={{ height: '663px', width: '240px' }} className={"transcriptionContainer"}>
          {lines.map((line: tIncomingTranscripts, index: number) => (
               <div key={index}>
                  <strong>{line.attendeeName}</strong>: {line.text}
                  <br />
                </div>
            ))
          }
          {currentLine?.length > 0 && currentLine.map((line, index) => (
              <div key={index}>
                <strong>{line.attendeeName}</strong>: {line.text}
                <br />
              </div>
          ))}
          <AlwaysScrollToBottom />
        </div>
      </SpaceBetween>
    </Container>
  );
};

export default Transcription;