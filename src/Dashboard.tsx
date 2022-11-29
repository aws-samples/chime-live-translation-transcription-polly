import React, {useEffect, useState} from 'react';
import "./App.css";
import ReactWordcloud from 'react-wordcloud';
import {onCreateMessage, onUpdateSummary} from "./graphql/subscriptions";
import {Heading} from '@aws-amplify/ui-react';
import {API, graphqlOperation} from "aws-amplify";
import {BarChart} from "./BarChart";
import {listSummaries} from "./graphql/queries";

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

export interface tSummaryObject {
    NumberofMessagesProcessed: number
    NumberofWordsProcssed: number
    language: string
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
    const [summaryInfo, setSummaryInfo] = useState<tSummaryObject[]>([])

    useEffect(() => {
        // get subscription messsages when subscriptions kicks off
        const subscription = (
            API.graphql(
                graphqlOperation(
                    onCreateMessage,
                )) as any).subscribe({
            next: (newData: any) => {
                const { value} = newData;
                if(value.data && value.data.onCreateMessage){
                    const { speaker, message, language } = value.data.onCreateMessage;
                    if(speaker === "arunmbalaji"){
                        setLeftSpeakerText([...leftSpeakerText, value.data.onCreateMessage])
                    } else {
                        setRightSpeakerText([...rightSpeakerText, value.data.onCreateMessage])
                    }
                }
            },
            error: (error: any) => console.warn(error)
        });

        console.log("listening")
        // return subscription?.current?.unsubscribe();
        // fetch and update translation for both speaker 1 and speaker 2
    }, [])


    const getSummaries = async () => {
        const result = await API.graphql(graphqlOperation(
            listSummaries,
        )) as any;
        console.log("getSummaries", result.data.listSummaries.items)
        if( result.data.listSummaries.items.length > 0){
            setSummaryInfo(result?.data?.listSummaries.items);

        }
    }

    // @ts-ignore
    useEffect(() => {
        getSummaries()
    }, [])

    useEffect(() => {
        const subscription = (
            API.graphql(
                graphqlOperation(
                    onUpdateSummary,
                )) as any).subscribe({
            next: async (newData: any) => {
                const {value} = newData;
                await getSummaries();
            },
            error: (error: any) => console.warn(error)
        });

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
                            <div key={val.createdAt} className={"speakerText"}>{val.speaker}: {val.message}</div>
                        )
                    })}
                </div>
                <div className="Center">
                    <BarChart summaryInfo={summaryInfo}/>
                    <ReactWordcloud words={words}/>
                </div>
                <div className="Right">
                    <div className={"speakerText"}>
                        Speaker: {rightSpeakerText.length > 0 && rightSpeakerText[0].speaker || "NA"}
                        {rightSpeakerText.map((val: tCreateMessageResponse) => {
                            return (
                                <div key={val.createdAt} className={"speakerText"}>{val.speaker}: {val.message}</div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
