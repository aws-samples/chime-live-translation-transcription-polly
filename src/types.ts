import MicrophoneStream from "microphone-stream";
import {TranscribeStreamingClient, TranscriptEvent} from "@aws-sdk/client-transcribe-streaming";
import {ICredentials} from "@aws-amplify/core";
import {LanguageCode} from "@aws-sdk/client-transcribe-streaming/dist-types/models/models_0";

export interface tSourceLanguage {
    language: string,
    code: string,
    icon: string
}

export interface tIncomingTranscripts {
    attendeeName: string,
    partial?: boolean,
    text?: string
    transcriptEvent?: string,
    sourceLanguage?: string
}

export interface tMeetingControlBarInput {
    transcribeStatus: boolean,
    setTranscribeStatus: (a: boolean) => void,
    setSourceLanguage: (a: string) => void,
    sourceLanguages: tSourceLanguage[],
    setLocalMute: (a: boolean) => void,
    microphoneStream: MicrophoneStream,
    sourceLanguage: string,
}

export interface tTranscriptionProps {
    targetLanguage: string;
    setLine: (a: tIncomingTranscripts[]) => void;
    transcripts: tIncomingTranscripts;
    lines: tIncomingTranscripts[];
}

export interface tVideoMeeting {
    setLine: (input: tIncomingTranscripts[]) => void,
    setTranscribeStatus: (input: boolean) => void,
    setTranslateStatus: (input: boolean) => void,
}

export interface tTranscriptionMeetingProps {
    transcribeStatus: boolean,
    sourceLanguage: LanguageCode,
    microphoneStream: MicrophoneStream,
    user: any,
    setMicrophoneStream: (m: MicrophoneStream) => void,
    setTranscripts: (t: tIncomingTranscripts) => void,
    localMute: boolean,
    setTranscriptionClient: (a: TranscribeStreamingClient) => void,
    currentCredentials: ICredentials,
    transcriptionClient: TranscribeStreamingClient,
}

