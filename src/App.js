import React, { useState } from 'react';
import PokerCalculator from './component/PokerCalculator';

const App = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="App">
      <div className="mb-4">
        <label>Select Language: </label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <PokerCalculator language={language} />
    </div>
  );
};

export default App;
