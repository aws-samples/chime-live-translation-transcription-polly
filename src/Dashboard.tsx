import React, {useEffect} from 'react';
import "./App.css";
import ReactWordcloud from 'react-wordcloud';
import {onCreateMessage} from "./graphql/subscriptions";
import {Heading} from '@aws-amplify/ui-react';
import {API, graphqlOperation} from "aws-amplify";

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


    useEffect(() => {
        // get subscription messsages when subscriptions kicks off
        const subscription = (
            API.graphql(
                graphqlOperation(
                    onCreateMessage,
                )) as any).subscribe({
            next: (newData: any) => {
                const {provider, value} = newData;
                console.log({provider, value}, "Next props")
            },
            error: (error: any) => console.warn(error)
        });
        console.log(subscription, "Subscription")

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
                    <div className={"speakerText"}>Left</div>
                </div>
                <div className="Center">
                    <ReactWordcloud words={words}/>
                </div>
                <div className="Right">
                    <div className={"speakerText"}>Right</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
