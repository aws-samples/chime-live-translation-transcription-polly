import React, { useState, useEffect } from 'react';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import * as TranscribeClient from './TranscribeClient';
import awsExports from './aws-exports';
import MicrophoneStream from "microphone-stream";
import {ICredentials} from "@aws-amplify/core";
import {TranscribeStreamingClient} from "@aws-sdk/client-transcribe-streaming";
Amplify.configure(awsExports);

interface tTranscriptionInput {
  transcribeStatus: boolean,
  sourceLanguage: string,
  microphoneStream: MicrophoneStream,
  user: any,
  setMicrophoneStream: any;
  setTranscripts: any
  localMute: boolean,
  setTranscriptionClient: (a: TranscribeStreamingClient) => void,
  currentCredentials: ICredentials,
  transcriptionClient: any,
}

interface tTranscripts {
  sourceLanguage: string,
  attendeeName: string,
  transcriptEvent: any,
  partial: boolean,
}

export function TranscriptionComponent(props: tTranscriptionInput) {
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
      // keep transcription, just mute
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
    try {
      await TranscribeClient.startRecording(
        sourceLanguage,
        onTranscriptionDataReceived,
        currentCredentials,
      );
    } catch (error) {
      alert('An error occurred while recording: ' + error.message);
      stopRecording();
    }
  };

  return <></>;
}

export default TranscriptionComponent;
