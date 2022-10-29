import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import VideoMeeting from './VideoMeeting';
import awsExports from './aws-exports';
import { MeetingProvider } from 'amazon-chime-sdk-component-library-react';

import {
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';

Amplify.configure(awsExports);

const App = () => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});

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
          <MeetingProvider>
            <VideoMeeting></VideoMeeting>
          </MeetingProvider>
        </ContentLayout>
      )}
    </Authenticator>
  );
};

export default App;
