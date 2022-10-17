import {
  ChimeSDKMeetingsClient,
  StartMeetingTranscriptionCommand,
  StopMeetingTranscriptionCommand,
} from '@aws-sdk/client-chime-sdk-meetings';
const config = {
  region: 'us-east-1',
};

const chimeSdkMeetingsClient = new ChimeSDKMeetingsClient(config);

var response = {
  statusCode: 200,
  body: '',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  },
};

export async function handler(event) {
  console.log(event);
  const body = JSON.parse(event.body);
  if (body.meetingId) {
    switch (body.action) {
      case true:
        console.log(`Starting Transcription for ${body.meetingId}`);
        if (await startMeetingTranscription(body.meetingId)) {
          response.body = JSON.stringify('Transcription started');
          response.statusCode = 200;
          return response;
        }
        break;
      case false:
        console.log(`Stopping Transcription for ${body.meetingId}`);
        if (await stopMeetingTranscription(body.meetingId)) {
          response.body = JSON.stringify('Transcription stopped');
          response.statusCode = 200;
          return response;
        }
        break;
      default:
    }
    response.body = JSON.stringify('Error with request');
    response.statusCode = 503;
    return response;
  } else {
    console.info('No meeting to transcribe');
    response.body = JSON.stringify('No meeting to transcribe');
    response.statusCode = 404;
    return response;
  }
}

async function startMeetingTranscription(meetingId) {
  try {
    const transcribeResponse = await chimeSdkMeetingsClient.send(
      new StartMeetingTranscriptionCommand({
        MeetingId: meetingId,
        TranscriptionConfiguration: {
          EngineTranscribeSettings: {
            LanguageCode: 'en-US',
          },
        },
      }),
    );
    console.log('Transcribe started');
    console.log(JSON.stringify(transcribeResponse));
    return true;
  } catch (err) {
    console.info(`${err}`);
    return false;
  }
}

async function stopMeetingTranscription(meetingId) {
  try {
    await chimeSdkMeetingsClient.send(
      new StopMeetingTranscriptionCommand({ MeetingId: meetingId }),
    );
    return true;
  } catch (err) {
    console.info(`${err}`);
    return false;
  }
}
