import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import VideoMeeting from './VideoMeeting';
import TranscriptionComponent from './TranscriptionMeeting';
import Transcription from './Transcription';
import MeetingControlBar from './MeetingControlBar';
import awsExports from './aws-exports';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';

import {
  ContentLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';
import {ICredentials} from "@aws-amplify/core";
import {CognitoUserSession} from "amazon-cognito-identity-js";

Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

export interface tSourceLanguage {
  language: string,
  code: string
}

export interface tIncomingTranscripts {
  attendeeName: string,
  partial?: boolean,
  text: string
  transcriptEvent?: any,
  sourceLanguage?: string
}


const sourceLanguages: tSourceLanguage[] = [
  { language: 'English - US', code: 'en-US' },
  { language: 'English - GB', code: 'en-GB' },
  { language: 'English - AU', code: 'en-AU' },
  { language: 'Spanish - US', code: 'es-US' },
  { language: 'French - CA', code: 'fr-CA' },
  { language: 'French', code: 'fr-FR' },
  { language: 'Italian', code: 'it-IT' },
  { language: 'German', code: 'de-DE' },
  { language: 'Portuguese - BR', code: 'pt-BR' },
  { language: 'Japanese', code: 'ja' },
  { language: 'Korean', code: 'ko-KR' },
  { language: 'Chinese - Simplified', code: 'zh-CN' },
];

const App = () => {
  const [currentCredentials, setCurrentCredentials] = useState<ICredentials>({
    accessKeyId: "",
    authenticated: false,
    expiration: undefined,
    identityId: "",
    secretAccessKey: "",
    sessionToken: ""
  });
  const [currentSession, setCurrentSession] = useState<CognitoUserSession>();
  const [transcripts, setTranscripts] = useState<tIncomingTranscripts>({
    attendeeName: "",
    partial: false,
    sourceLanguage: "",
    text: "",
    transcriptEvent: undefined
  });
  const [lines, setLine] = useState<tIncomingTranscripts[]>([]);
  const [transcribeStatus, setTranscribeStatus] = useState<boolean>(false);
  const [translateStatus, setTranslateStatus] = useState<boolean>(false);
  const [localMute, setLocalMute] = useState<boolean>(false);
  const [sourceLanguage, setSourceLanguage] = useState<string>('en-US');
  const [microphoneStream, setMicrophoneStream] = useState();
  const [transcriptionClient, setTranscriptionClient] = useState();

  useEffect(() => {
    async function getAuth() {
      const session: CognitoUserSession = await Auth.currentSession()
      setCurrentSession(session);
      setCurrentCredentials(await Auth.currentUserCredentials());
      console.log(`authState: ${JSON.stringify(currentSession)}`);
      console.log(`currentCredentials: ${JSON.stringify(currentCredentials)}`);
    }
    getAuth();
  }, []);

  const formFields = {
    signUp: {
      email: {
        order: 1,
        isRequired: true,
      },
      name: {
        order: 2,
        isRequired: true,
      },
      password: {
        order: 3,
      },
      confirm_password: {
        order: 4,
      },
    },
  };


  return (
    <Authenticator loginMechanisms={['email']} formFields={formFields}>
      {({ signOut, user  }) => (
          <>
            <ContentLayout
                header={
                  <SpaceBetween size='m'>
                    <Header
                        className='ContentHeader'
                        variant='h2'
                        actions={
                          <Button variant='primary' onClick={signOut}>
                            Sign out
                          </Button>
                        }
                    >
                      Amazon Chime SDK Meeting
                    </Header>
                  </SpaceBetween>
                }
            >
              <SpaceBetween direction='horizontal' size='xs'>
                <SpaceBetween direction='vertical' size='l'>
                  <Container
                      className='MeetingContainer'
                      footer={
                        <MeetingControlBar
                            transcribeStatus={transcribeStatus}
                            setTranscribeStatus={setTranscribeStatus}
                            sourceLanguages={sourceLanguages}
                            setSourceLanguage={setSourceLanguage}
                            setLocalMute={setLocalMute}
                        />
                      }
                  >
                    <VideoMeeting
                        setLine={setLine}
                        setTranscribeStatus={setTranscribeStatus}
                        setTranslateStatus={setTranslateStatus}
                    />
                  </Container>
                </SpaceBetween>
                <Transcription
                    targetLanguage={sourceLanguage}
                    setLine={setLine}
                    transcripts={transcripts}
                    lines={lines}
                ></Transcription>
              </SpaceBetween>
            </ContentLayout>

            <TranscriptionComponent
                currentCredentials={currentCredentials}
                transcribeStatus={transcribeStatus}
                sourceLanguage={sourceLanguage}
                localMute={localMute}
                setTranscriptionClient={setTranscriptionClient}
                microphoneStream={microphoneStream}
                transcriptionClient={transcriptionClient}
                user={user}
                setMicrophoneStream={setMicrophoneStream}
                setTranscripts={setTranscripts}
            />
          </>
        )}
    </Authenticator>
  );
};

export default App;
