import React, { useState } from 'react';

const StatisticLine = ({ text, value }) => {
    return (
        <p>{text}: {value}</p>
    );
};

const Statistics = ({ props }) => {
    const { good, neutral, bad, total, average, positivePercentage } = props;

    if (total === 0) {
        return <p>No feedback given</p>;
    }

    return (
        <div>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="total" value={total} />
            <StatisticLine text="average" value={average.toFixed(1)} />
            <StatisticLine text="positive" value={`${positivePercentage.toFixed(1)} %`} />
        </div>
    );
};

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGood = () => setGood(good + 1);
    const handleNeutral = () => setNeutral(neutral + 1);
    const handleBad = () => setBad(bad + 1);

    const total = good + neutral + bad;
    const average = total > 0 ? (good - bad) / total : 0;
    const positivePercentage = total > 0 ? (good / total) * 100 : 0;

    const props = {
        good,
        neutral,
        bad,
        total,
        average,
        positivePercentage,
    };

    return (
        <div>
            <h1>give feedback</h1>
            <button onClick={handleGood}>good</button>
            <button onClick={handleNeutral}>neutral</button>
            <button onClick={handleBad}>bad</button>
            <h2>statistics</h2>
            <Statistics props={props} />
        </div>
    );
}

export default App;
