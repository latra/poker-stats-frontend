import React, { useState, useEffect, useCallback } from 'react';
import CardSelector from './CardSelector';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import strings from '../i18n'; // Import the i18n file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PokerCalculator = ({ language = 'en' }) => {
  const [handCards, setHandCards] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [numPlayers, setNumPlayers] = useState(2);
  const [probability, setProbability] = useState(null);
  const [playerHands, setPlayerHands] = useState(null);
  const [opponentHands, setOpponentHands] = useState(null);

  const langStrings = strings[language]; // Get strings based on selected language

  // Function to handle card selection
  const handleCardSelect = (card, location) => {
    if (location === 'hand') {
      setHandCards((prev) => [...prev, card]);
    } else {
      setTableCards((prev) => [...prev, card]);
    }
  };

  const calculateProbability = useCallback(async () => {
    if (handCards.length === 2 && [0, 3, 4, 5].includes(tableCards.length)) {
      const response = await fetch('https://europe-southwest1-wowvoices.cloudfunctions.net/casino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handCards, tableCards, numPlayers }),
      });
      const result = await response.json();
      setProbability(result.probability);
      setPlayerHands(result.player_hands);
      setOpponentHands(result.opponent_hands);
    }
  }, [handCards, tableCards, numPlayers]);


  useEffect(() => {
    if (handCards.length === 2 && [0, 3, 4, 5].includes(tableCards.length)) {
      console.log("going from table");

      calculateProbability();
    }
  }, [tableCards, handCards, calculateProbability]);

  const resetTable = () => {
    setHandCards([]);
    setTableCards([]);
    setProbability(null);
    setPlayerHands(null);
    setOpponentHands(null);
  };

  const chartData = {
    labels: langStrings.cardLabels,
    datasets: [
      {
        label: langStrings.player,
        data: playerHands ? Object.values(playerHands) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: langStrings.opponents,
        data: opponentHands ? Object.values(opponentHands) : [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: langStrings.chartTitle,
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{langStrings.pokerCalculatorTitle}</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg mb-2">{langStrings.selectHandCards}</h2>
          <CardSelector onCardSelect={handleCardSelect} location="hand" language={language} />
          <div className="mt-2">
            <strong>{langStrings.handCards}</strong> {handCards.join(', ')}
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-2">{langStrings.selectTableCards}</h2>
          <CardSelector onCardSelect={handleCardSelect} location="table" language={language} />
          <div className="mt-2">
            <strong>{langStrings.tableCards}</strong> {tableCards.join(', ')}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label>{langStrings.numPlayers} </label>
        <input
          type="number"
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
          className="border p-2"
        />
      </div>

      <div className="mt-4">
        <button
          onClick={resetTable}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {langStrings.resetTable}
        </button>
      </div>

      {probability !== null && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">{langStrings.winProbability} {probability}%</h3>
        </div>
      )}

      {playerHands && opponentHands && (
        <div className="mt-8">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default PokerCalculator;
