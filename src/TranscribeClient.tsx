import {TranscribeStreamingClient} from '@aws-sdk/client-transcribe-streaming';
import MicrophoneStream from 'microphone-stream';
import {StartStreamTranscriptionCommand} from '@aws-sdk/client-transcribe-streaming';

let sampleRate = 44100;

export const startRecording = async (
    language: string,
    callback: (data: any, partial: boolean, transcriptionClient: any, microphoneStream: MicrophoneStream) => void,
    currentCredentials: any,
    muted: boolean,
) => {
    if (!language) {
        console.log('no language');
        return false;
    }
    console.log(`selected language: ${language}`);
    const microphoneStream = await createMicrophoneStream();

    const transcribeClient = new TranscribeStreamingClient({
        region: 'us-east-1',
        credentials: currentCredentials,
    });
    return await startStreaming(
        language,
        microphoneStream,
        transcribeClient,
        callback,
        muted
    );
};

/**
 * Mutes the microphone stream, withou stopping the transcription client.
 * @param microphoneStream MicrophoneStream
 */
export const muteMicrophoneContinueTranscribe = function (microphoneStream: MicrophoneStream,
) {
    if (microphoneStream) {
        return microphoneStream.stop();
    }
}

export const stopRecording = function (
    microphoneStream: MicrophoneStream,
    transcribeClient: { destroy: () => void; }
) {
    if (microphoneStream) {
        microphoneStream.stop();
    }
    if (transcribeClient) {
        transcribeClient.destroy();
    }
};

const createMicrophoneStream = async () => {
    let mediaStream: MediaStream | null = null;
    try {
        mediaStream = await window.navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });
    } catch (e) {
        console.error(e);
    }
    if (mediaStream) {
        sampleRate = mediaStream.getAudioTracks()[0].getSettings().sampleRate;
        console.log('Sample rate', sampleRate);
    }

    const microphoneStream = mediaStream
        ? new MicrophoneStream({
            stream: mediaStream,
            objectMode: false,
        })
        : new MicrophoneStream();

    console.log(
        'inside - after - createMicrophoneStream - microphoneStream',
        microphoneStream,
    );
    return microphoneStream;
};

const startStreaming = async (
    language: string,
    microphoneStream: MicrophoneStream,
    transcribeClient: TranscribeStreamingClient,
    callback: { (data: any, partial: boolean, transcriptionClient: TranscribeStreamingClient, microphoneStream: MicrophoneStream): void; (arg0: string, arg1: any, arg2: any, arg3: any): void; },
    muted: boolean,
) => {
    const audioStream = await getAudioStream(microphoneStream, muted);

    const command = new StartStreamTranscriptionCommand({
        LanguageCode: language,
        MediaEncoding: 'pcm',
        MediaSampleRateHertz: sampleRate,
        AudioStream: audioStream,
    });
    const data = await transcribeClient.send(command);

    if (data.TranscriptResultStream) {
        for await (const event of data?.TranscriptResultStream) {
            if (event?.TranscriptEvent?.Transcript) {
                for (const result of event?.TranscriptEvent?.Transcript.Results || []) {
                    if (result?.Alternatives && result?.Alternatives[0].Items) {
                        const noOfResults = result?.Alternatives[0].Items?.length;
                        let wholeSentence = ``;
                        for (let i = 0; i < noOfResults; i++) {
                            wholeSentence += ` ${result?.Alternatives[0].Items[i].Content}`;
                        }
                        callback(
                            wholeSentence,
                            result.IsPartial,
                            transcribeClient,
                            microphoneStream,
                        );
                    }
                }
            }
        }
    }
};

const pcmEncode = (input: Float32Array) => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
};

const getAudioStream = async function* (microphoneStream: MicrophoneStream, muted: boolean) {
    const pcmEncodeChunk = (audioChunk: Buffer) => {
        const raw = MicrophoneStream.toRaw(audioChunk);
        if (raw === null) {
            return;
        }
        return Buffer.from(pcmEncode(raw));
    };

    // @ts-ignore
    for await (const chunk of microphoneStream) {
        let encodedChunk = pcmEncodeChunk(chunk);
        if (muted) {
            encodedChunk = Buffer.alloc(encodedChunk.length);
        }
        if (chunk.length <= sampleRate) {
            yield {
                AudioEvent: {
                    AudioChunk: pcmEncodeChunk(chunk),
                },
            };
        }
    }
};
