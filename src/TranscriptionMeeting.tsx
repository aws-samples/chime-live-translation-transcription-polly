import React, { useEffect } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import * as TranscribeClient from './TranscribeClient';
import MicrophoneStream from "microphone-stream";
import {TranscribeStreamingClient} from "@aws-sdk/client-transcribe-streaming";
import {tTranscriptionMeetingProps} from "./types";

export function TranscriptionComponent(props: tTranscriptionMeetingProps) {
  const {
    transcribeStatus,
    sourceLanguage,
    microphoneStream,
    transcriptionClient,
    currentCredentials,
    setMicrophoneStream,
    setTranscriptionClient,
    user,
    setTranscripts,
    localMute,
  } = props;

  const stopRecording = function () {
    if (microphoneStream && transcriptionClient) {
      TranscribeClient.stopRecording(microphoneStream, transcriptionClient);
    }
  };

  async function toggleTranscribe() {
    if(localMute){
      // keep transcription, just mute + prevent spinning up new transcription client
      return;
    }
    if (transcribeStatus) {
      console.log('startRecording');
      await startRecording();
    } else {
      console.log('stopRecording');
      await stopRecording();
    }
  }

  useEffect(() => {
    toggleTranscribe();
  }, [transcribeStatus]);

  useEffect(() => {
    console.log(transcriptionClient);
    toggleTranscribe();
  }, [localMute]);

  const onTranscriptionDataReceived = (
    data: any,
    partial: boolean,
    transcriptionClient: TranscribeStreamingClient,
    microphoneStream: MicrophoneStream,
  ) => {
    setTranscripts({
      sourceLanguage: sourceLanguage,
      attendeeName: user.attributes.name,
      transcriptEvent: data,
      partial: partial,
    });
    setMicrophoneStream(microphoneStream);
    setTranscriptionClient(transcriptionClient);
  };

  const startRecording = async () => {
    if (sourceLanguage === '') {
      alert('Please select a language');
      return;
    }
    if(!currentCredentials){
      console.error('credentials not found');
      return;
    }
    try {
      await TranscribeClient.startRecording(
        sourceLanguage,
        onTranscriptionDataReceived,
        currentCredentials,
        localMute
      );
    } catch (error) {
      alert('An error occurred while recording: ' + error.message);
      stopRecording();
    }
  };

  return <></>;
}

export default TranscriptionComponent;
