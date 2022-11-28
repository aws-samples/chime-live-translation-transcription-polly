import React, {useEffect, useState} from 'react';
import "./App.css";
import ReactWordcloud from 'react-wordcloud';
import {onCreateMessage} from "./graphql/subscriptions";
import {Heading} from '@aws-amplify/ui-react';
import {API, graphqlOperation} from "aws-amplify";

interface tCreateMessageResponse {
    createdAt: string
    direction:string
    language:string
    meetingId: string
    message: string
    speaker: string
    updatedAt: string
    user: string
}

function Dashboard() {
    const words = [
        {
            text: 'told',
            value: 64,
        },
        {
            text: 'mistake',
            value: 55,
        },
        {
            text: 'thought',
            value: 75,
        },
        {
            text: 'bad',
            value: 88,
        },
    ]

    const [leftSpeakerText, setLeftSpeakerText] = useState<tCreateMessageResponse[]>([])
    const [rightSpeakerText, setRightSpeakerText] = useState<tCreateMessageResponse[]>([])

    useEffect(() => {
        // get subscription messsages when subscriptions kicks off
        const subscription = (
            API.graphql(
                graphqlOperation(
                    onCreateMessage,
                )) as any).subscribe({
            next: (newData: any) => {
                const {provider, value} = newData;
                if(value.data && value.data.onCreateMessage){
                    const { speaker, message, language } = value.data.onCreateMessage;
                    if(speaker === "arunmbalaji"){
                        setLeftSpeakerText([...leftSpeakerText, value.data.onCreateMessage])
                        console.log("arunmbalaji", value.data.onCreateMessage)
                    } else {
                        setRightSpeakerText([...rightSpeakerText, value.data.onCreateMessage])
                        console.log("other", value.data.onCreateMessage)
                    }
                }
            },
            error: (error: any) => console.warn(error)
        });
        // subscription.unsubscribe();
        // fetch and update translation for both speaker 1 and speaker 2
    }, [])

    return (
        <div className="App">
            <div className="Header">
                <Heading level={1}>
                    Live Translations
                </Heading>
            </div>
            <div className="Content">
                <div className="Left">
                    Speaker: {leftSpeakerText.length > 0 && leftSpeakerText[0].speaker || "NA"}
                    {leftSpeakerText.map((val: tCreateMessageResponse) => {
                        return (
                            <div className={"speakerText"}>{val.speaker}: {val.message}</div>
                        )
                    })}
                </div>
                <div className="Center">
                    <ReactWordcloud words={words}/>
                </div>
                <div className="Right">
                    <div className={"speakerText"}>
                        Speaker: {rightSpeakerText.length > 0 && rightSpeakerText[0].speaker || "NA"}
                        {rightSpeakerText.map((val: tCreateMessageResponse) => {
                            return (
                                <div className={"speakerText"}>{val.speaker}: {val.message}</div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
