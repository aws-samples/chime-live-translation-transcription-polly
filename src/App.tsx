import React, {useState, useEffect} from 'react';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import AmplifyUser from "aws-amplify"
import {Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import VideoMeeting from './VideoMeeting';
import TranscriptionComponent from './TranscriptionMeeting';
import Transcription from './Transcription';
import MeetingControlBar from './MeetingControlBar';
import awsExports from './aws-exports';
import {AmazonAIPredictionsProvider} from '@aws-amplify/predictions';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import {
    ContentLayout,
    Container,
    Header,
    SpaceBetween,
    Button,
} from '@cloudscape-design/components';
import {ICredentials} from "@aws-amplify/core";
import {CognitoUserSession} from "amazon-cognito-identity-js";
import {TranscribeStreamingClient} from "@aws-sdk/client-transcribe-streaming";
import {tIncomingTranscripts, tSourceLanguage} from "./types";
import MicrophoneStream from "microphone-stream";
import {SignOut} from "@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator";
import {LanguageCode} from "@aws-sdk/client-transcribe-streaming";

Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const sourceLanguages: tSourceLanguage[] = [
    {language: 'English - US', code: LanguageCode.EN_US, icon: 'images/en.png'},
    {language: 'English - GB', code: LanguageCode.EN_GB, icon: 'images/en.png'},
    {language: 'English - AU', code: LanguageCode.EN_AU, icon: 'images/en.png'},
    {language: 'Spanish - US',
        code: LanguageCode.ES_US, icon: 'images/es.png'},
    {language: 'French - CA',
        code: LanguageCode.FR_CA, icon: 'images/fr.png'},
    {language: 'French',
        code: LanguageCode.FR_FR, icon: 'images/fr.png'},
    {language: 'Italian',
        code: LanguageCode.IT_IT, icon: 'images/it.png'},
    {language: 'German',
        code: LanguageCode.DE_DE, icon: 'images/de.png'},
    {language: 'Portuguese - BR',
        code: LanguageCode.PT_BR, icon: 'images/pt.png'},
    {language: 'Japanese',
        code: LanguageCode.JA_JP, icon: 'images/ja.png'},
    {language: 'Korean',
        code: LanguageCode.KO_KR, icon: 'images/ko.png'},
    {language: 'Chinese - Simplified',
        code: LanguageCode.ZH_CN, icon: 'images/zh.png'},
    {language: 'Hindi',
        code: LanguageCode.HI_IN, icon: 'images/hi.png'},
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
    const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>(LanguageCode.EN_US);
    const [microphoneStream, setMicrophoneStream] = useState<MicrophoneStream>();
    const [transcriptionClient, setTranscriptionClient] = useState<TranscribeStreamingClient | null>(null);

    useEffect(() => {
        async function getAuth() {
            const currSession = await Auth.currentSession();
            const currCreds = await Auth.currentUserCredentials()
            return {
                currSession,
                currCreds
            }
        }

        getAuth().then((res) => {
            const {currSession, currCreds} = res;
            setCurrentSession(currSession);
            setCurrentCredentials(currCreds);
            console.log(res)
        });
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
        <Router>
            <Authenticator loginMechanisms={['email']} formFields={formFields}>
                {(authProps: { signOut?: SignOut; user?: any }) => (
                    <>
                        <Routes>
                            <Route path="/" element={<>
                                <ContentLayout
                                    header={
                                        <SpaceBetween size='m'>
                                            <Header
                                                className='ContentHeader'
                                                variant='h2'
                                                actions={
                                                    <Button variant='primary' onClick={authProps.signOut}>
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
                                                        sourceLanguage={sourceLanguage}
                                                        microphoneStream={microphoneStream}/>
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
                                    user={authProps.user}
                                    setMicrophoneStream={setMicrophoneStream}
                                    setTranscripts={setTranscripts}
                                />
                            </>}/>
                        </Routes>
                    </>
                )}
            </Authenticator>
        </Router>
    );
};

export default App;
