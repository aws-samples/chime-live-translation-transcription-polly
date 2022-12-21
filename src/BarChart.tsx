import React, {useEffect, useState} from "react";
import { Chart } from "react-google-charts";
import {tSummaryObject} from "./Dashboard";

interface tBarChartProps {
    summaryInfo: tSummaryObject[]
}

export function BarChart(props: tBarChartProps) {
    const [formattedData, setFormattedData] = useState([]);
    useEffect(() => {
        if(props.summaryInfo.length > 0){
            const finishedResult = [["Languages", "NumberOfWordsProcessed"]];
            props.summaryInfo.forEach((lang: tSummaryObject, idx) =>{
                finishedResult[idx+1] = [lang.language, lang.NumberofWordsProcssed.toString()]
            })
            console.error(JSON.stringify(finishedResult), "finishedResult");
            setFormattedData(finishedResult);

        }
    }, [props.summaryInfo])

    const data = [
        ["Year", "Sales", "Expenses", "Profit"],
        ["2014", 1000, 400, 200],
        ["2015", 1170, 460, 250],
        ["2016", 660, 1120, 300],
        ["2017", 1030, 540, 350],
    ];

    const options = {
        chart: {
            title: "Live Translations",
            subtitle: "Language Breakdown Summary",
        },
    };

    return (
        <Chart
            chartType="Bar"
            width="100%"
            height="400px"
            data={formattedData}
            options={options}
        />
    );
}
