import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import * as TranscribeClient from './TranscribeClient';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

interface tTranscriptionInput {
  transcribeStatus: any,
  sourceLanguage,
  microphoneStream,
  transcriptionClient,
  currentCredentials,
  setMicrophoneStream,
  setTranscriptionClient,
  user,
  setTranscripts,
  localMute,
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
    data,
    partial,
    transcriptionClient,
    microphoneStream,
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
