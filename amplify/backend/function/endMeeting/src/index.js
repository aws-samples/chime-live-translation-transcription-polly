import {
  ChimeSDKMeetingsClient,
  DeleteMeetingCommand,
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
    console.log(`Ending Meeting: ${body.meetingId}`);

    if (await deleteMeeting(body.meetingId)) {
      console.info('Meeting Deleted');
      response.body = JSON.stringify('Meeting deleted');
      response.statusCode = 200;
      return response;
    } else {
      response.body = JSON.stringify('Error deleting meeting');
      response.statusCode = 503;
      return response;
    }
  } else {
    console.info('No meeting to delete');
    response.body = JSON.stringify('No meeting to delete');
    response.statusCode = 404;
    return response;
  }
}

async function deleteMeeting(meetingId) {
  try {
    await chimeSdkMeetingsClient.send(
      new DeleteMeetingCommand({
        MeetingId: meetingId,
      }),
    );
    return true;
  } catch (err) {
    console.info(`${err}`);
    return false;
  }
}
