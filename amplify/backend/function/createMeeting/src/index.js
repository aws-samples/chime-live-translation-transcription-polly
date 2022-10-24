import { randomUUID } from 'crypto';

import {
  ChimeSDKMeetingsClient,
  CreateMeetingCommand,
  CreateAttendeeCommand,
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
  const requestId = body.requestId;
  const name = body.name;
  const meetingInfo = await createMeeting(requestId || randomUUID());
  if (meetingInfo) {
    const attendeeInfo = await createAttendee(
      meetingInfo.Meeting.MeetingId,
      name,
    );
    if (attendeeInfo) {
      const responseInfo = {
        Meeting: meetingInfo.Meeting,
        Attendee: attendeeInfo.Attendee,
      };

      console.info('joinInfo: ' + JSON.stringify(responseInfo));
      response.body = JSON.stringify(responseInfo);
      response.statusCode = 200;
      return response;
    } else {
      response.body = JSON.stringify('Error creating attendee');
      response.statusCode = 503;
      return response;
    }
  } else {
    response.body = JSON.stringify('Error creating meeting');
    response.statusCode = 503;
    return response;
  }
}

async function createMeeting(requestId) {
  console.log(`Creating Meeting for Request ID: ${requestId}`);

  try {
    const meetingInfo = await chimeSdkMeetingsClient.send(
      new CreateMeetingCommand({
        ClientRequestToken: requestId,
        MediaRegion: 'us-east-1',
        ExternalMeetingId: randomUUID(),
      }),
    );
    return meetingInfo;
  } catch (err) {
    console.info(`Error: ${err}`);
    return false;
  }
}

async function createAttendee(meetingId, name) {
  console.log(`Creating Attendee for Meeting: ${meetingId}`);
  try {
    const attendeeInfo = await chimeSdkMeetingsClient.send(
      new CreateAttendeeCommand({
        MeetingId: meetingId,
        ExternalUserId: name,
      }),
    );
    return attendeeInfo;
  } catch (err) {
    console.info(`${err}`);
    return false;
  }
}
