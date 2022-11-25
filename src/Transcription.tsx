import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import Predictions from '@aws-amplify/predictions';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import {DataMessage} from "amazon-chime-sdk-js";
import {tIncomingTranscripts, tTranscriptionProps} from "./types";
import {Amplify, Auth, API, graphqlOperation} from "aws-amplify";
import {createMessage} from "./graphql/mutations";
import {CreateMessageInput} from "./API"


interface tPollyVoiceMap {
  voice: string,
  code: string
}
// for polly events
// @ts-ignore
const pollyevents = [];


export interface IMessage extends CreateMessageInput {
  translatedText?: string
}

const sendMessage = async (speaker: string, message: string, language: string, direction: string, user: string) => {
  let r = (Math.random() + 1).toString(36).substring(7);


  const params: CreateMessageInput = {
    speaker: speaker,
    createdAt: r,
    meetingId: "123",
    message: message,
    user: user,
    language: language,
    direction: direction,
  }

  const sendResult:any = await API.graphql(
    graphqlOperation(createMessage, {
        input: params
    })
  )
}

const sourceLanguages: tPollyVoiceMap[] = [
  { voice: 'Joey', code: 'en-US' },
  { voice: 'Brian', code: 'en-GB' },
  { voice: 'Russell', code: 'en-AU' },
  { voice: 'Miguel', code: 'es-US' },
  { voice: 'Liam', code: 'fr-CA' },
  { voice: 'Mathieu', code: 'fr-FR' },
  { voice: 'Giorgio', code: 'it-IT' },
  { voice: 'Hans', code: 'de-DE' },
  { voice: 'Ricardo', code: 'pt-BR' },
  { voice: 'Takumi', code: 'ja-JP' },
  { voice: 'Seoyeon', code: 'ko-KR' },
  { voice: 'Zhiyu', code: 'zh-CN' },
  { voice: 'Aditi', code: 'hi-IN' }
];

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
    setLine: any,
    targetLanguage: string,
    currentAttendee: string
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

    if (targetLanguage) {
      pollyevents.unshift({outputText,targetLanguage})
      console.log("testab:Event added " + pollyevents.length)
      //generateAudio(outputText,targetLanguage)
      sendMessage(currentAttendee,outputText,incomingTranscripts.sourceLanguage,"Received",incomingTranscripts.attendeeName).then((response: any) => {
        console.log(response, "Response from appsync");
      }).catch(err => console.log("Error occurred" + err));
    }
    else {
      sendMessage(currentAttendee,outputText,incomingTranscripts.sourceLanguage, "Sent",incomingTranscripts.attendeeName).then((response: any) => {
        console.log(response, "Response from appsync");
      }).catch(err => console.log("Error occurred" + err));
    }
  }
}

// @ts-ignore
const process = async (controlprocess) => {
  console.log("testmaster: process started")
  while (controlprocess[0]) {
    // console.log("testab:processing event " + pollyevents.length)
    if (pollyevents.length > 0) {
      // console.log("playing " + pollyevents.pop());
      // @ts-ignore
      const currentevent = pollyevents.pop()
      console.log("testab:inside audio generation : " + pollyevents.length)
      console.log("testab:Current event" + currentevent);
      await generateAudio(currentevent.outputText, currentevent.targetLanguage);
    } else {
      await new Promise((resolve) => setTimeout(() => resolve(0), 100));
    }
  }
  console.log("testmaster: process ended")
}; 

const generateAudio = async (
  textToSpeech: string,
  targetLanguage: string
) => {
  var audio = new Audio();
  console.log("testab:starting the speech to text for the text : " + textToSpeech);
  var voiceName:tPollyVoiceMap = sourceLanguages.find(e => e.code === targetLanguage);
  // @ts-ignore
  let result = await Predictions.convert({
    textToSpeech: {
      source: {
        text: textToSpeech,
        language: targetLanguage
      },
      voiceId: voiceName.voice,
    }
  });
  console.log("testab:Generation completed. Playing...")
  // @ts-ignore
  audio.src = result.speech.url;
  console.log("testab: received text" + textToSpeech);
  await new Promise((resolve) => {
    audio.addEventListener('ended',function(){
        resolve(0);
        console.log("testab: After the ended event" + textToSpeech);
    });
    audio.play();
  });
  console.log("testab: after the await event of ended")
  // .then(result => {
  //     console.log("Generation completed. Playing...")
  //     // @ts-ignore
  //     audio.src = result.speech.url;
  //     audio.play();
  // }).catch(err => console.log("Error occurred" + err))

}
const Transcription = (props: tTranscriptionProps) => {
  const { targetLanguage, setLine, transcripts, lines } = props;
  const currentAttendee = transcripts.attendeeName;
  const audioVideo = useAudioVideo();
  const [incomingTranscripts, setIncomingTranscripts] = useState<tIncomingTranscripts>();
  const [currentLine, setCurrentLine] = useState<tIncomingTranscripts[]>([]);

  useEffect(() => {
    let controlprocess = [true]
    process(controlprocess)
    return ( () => {
      controlprocess[0] = false;
    })
  }, []);

  useEffect(() => {
    async function transcribeText() {
      if (transcripts && transcripts.transcriptEvent) {
        handlePartialTranscripts(
            transcripts,
            transcripts.transcriptEvent,
            setCurrentLine,
            setLine,
            null,
            currentAttendee
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
              setLine,
              targetLanguage,
              currentAttendee
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
              setLine,
              targetLanguage,
              currentAttendee
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
