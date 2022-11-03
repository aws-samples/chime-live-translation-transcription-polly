import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import {
  useMeetingManager,
  MeetingStatus,
  useToggleLocalMute,
  useAudioVideo,
  DeviceLabels,
  VideoTileGrid,
  useMeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import {
  ContentLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';
import '@cloudscape-design/global-styles/index.css';
import * as TranscribeClient from './TranscribeClient';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

export function TranscriptionComponent(props) {
  const audioVideo = useAudioVideo();
  const {
    selectedLanguage,
    transcribeStatus,
    sourceLanguage,
    handleInputLanguageList,
    microphoneStream,
    transcriptionClient,
    userCredentials,
    currentSession,
    currentCredentials,
    setMicrophoneStream,
    setTranscriptionClient,
    transcribedText,
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
    console.log('before start');
    console.log(`language: ${sourceLanguage}`);
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
