import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import Predictions from '@aws-amplify/predictions';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import {DataMessage} from "amazon-chime-sdk-js";
import {tIncomingTranscripts, tTranscriptionProps} from "./types";

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

const Transcription = (props: tTranscriptionProps) => {
  const { targetLanguage, setLine, transcripts, lines } = props;
  const audioVideo = useAudioVideo();
  const [incomingTranscripts, setIncomingTranscripts] = useState<tIncomingTranscripts>();
  const [currentLine, setCurrentLine] = useState<tIncomingTranscripts[]>([]);

  useEffect(() => {
    async function transcribeText() {
      if (transcripts && transcripts.transcriptEvent) {
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
        if (incomingTranscripts.sourceLanguage === targetLanguage) {
          handlePartialTranscripts(
              incomingTranscripts,
              incomingTranscripts.transcriptEvent,
              setCurrentLine,
              setLine
          );
        } else {
          const translateResult = await Predictions.convert({
            translateText: {
              source: {
                text: incomingTranscripts.transcriptEvent,
                language: incomingTranscripts.sourceLanguage,
              },
              targetLanguage: targetLanguage,
            },
          });

          handlePartialTranscripts(
              incomingTranscripts,
              translateResult.text,
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
    audioVideo.realtimeSubscribeToReceiveDataMessage(
      'transcriptEvent',
      (data: DataMessage) => {
        const receivedData = (data && data.json()) || {};
        const { message } = receivedData;
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
