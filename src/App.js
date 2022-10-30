import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import VideoMeeting from './VideoMeeting';
import TranscriptionMeeting from './TranscriptionMeeting';
import Transcription from './Transcription';
import MeetingControlBar from './MeetingControlBar';
import awsExports from './aws-exports';
import {
  Meeting,
  MeetingProvider,
} from 'amazon-chime-sdk-component-library-react';

import {
  ContentLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';

Amplify.configure(awsExports);

const sourceLanguages = [
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
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});
  const [transcripts, setTranscripts] = useState([]);
  const [lines, setLine] = useState([]);
  const [transcribeStatus, setTranscribeStatus] = useState(false);
  const [translateStatus, setTranslateStatus] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');

  useEffect(() => {
    async function getAuth() {
      setCurrentSession(await Auth.currentSession());
      setCurrentCredentials(await Auth.currentUserCredentials());
      console.log(`authState: ${JSON.stringify(currentSession)}`);
      console.log(`currentCredentials: ${JSON.stringify(currentCredentials)}`);
    }
    getAuth();
  }, []);

  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <MeetingProvider>
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
                      translateStatus={translateStatus}
                      setTranslateStatus={setTranslateStatus}
                      sourceLanguages={sourceLanguages}
                      targetLanguage={targetLanguage}
                      sourceLanguage={sourceLanguage}
                      setSourceLanguage={setSourceLanguage}
                      setTranscripts={setTranscripts}
                      setLine={setLine}
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
                transcribeStatus={transcribeStatus}
                setTranscribeStatus={setTranscribeStatus}
                translateStatus={translateStatus}
                setTranslateStatus={setTranslateStatus}
                sourceLanguages={sourceLanguages}
                targetLanguage={targetLanguage}
                sourceLanguage={sourceLanguage}
                setSourceLanguage={setSourceLanguage}
                setTranscripts={setTranscripts}
                setLine={setLine}
                transcripts={transcripts}
                lines={lines}
              ></Transcription>
            </SpaceBetween>
          </ContentLayout>
        </MeetingProvider>
      )}
    </Authenticator>
  );
};

export default App;
