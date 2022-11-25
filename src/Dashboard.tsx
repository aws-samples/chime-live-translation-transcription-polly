import React from 'react';
import "./App.css";
import ReactWordcloud from 'react-wordcloud';


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
  
  return (
    <div className="App">
      <div className="Header"></div>
      <div className="Content">
        <div className="Left">

        </div>
        <div className="Center">

        <ReactWordcloud words={words} />

        </div>
        <div className="Right">

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
