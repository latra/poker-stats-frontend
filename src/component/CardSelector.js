import React, { useState, useEffect } from 'react';
import strings from '../i18n'; // Import the i18n strings


const CardSelector = ({ onCardSelect, location, language = 'en' }) => {
  const [selectedSuit, setSelectedSuit] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');

  // Get the language strings based on the selected language
  const langStrings = strings[language];
  const handleValueClick = (value) => {
    setSelectedValue(value);
  };
  // Automatically add the card once the suit is selected and value exists
  useEffect(() => {
    if (selectedSuit && selectedValue) {
      onCardSelect(`${selectedValue}${selectedSuit}`, location);
      setSelectedSuit(null);
      setSelectedValue(''); // Reset both after selection
    }
  }, [selectedSuit, selectedValue, onCardSelect, location]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">
        {langStrings.selectCard} {location === 'hand' ? langStrings.hand : langStrings.table}
      </h3>

      {/* Values Selection */}

      <div className="grid grid-cols-4 gap-2 mb-4">
        {langStrings.values.map((value) => (
          <button
            key={value}
            className={`p-2 border rounded-md text-xl cursor-pointer transition-colors duration-300 ${
              selectedValue === value ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleValueClick(value)}
          >
            {value}
          </button>
        ))}
      </div>
      {/* Suits Selection */}
      <div className="flex justify-around mb-4">
        {langStrings.suits.map((suit) => (
          <button
            key={suit}
            className={`p-4 rounded-md text-4xl cursor-pointer transition-colors duration-300 ${
              suit === '♥' || suit === '♦'
                ? 'bg-red-500 text-white'
                : 'bg-black text-white'
            }`}
            style={{ width: '80px', height: '80px' }} // Make buttons bigger
            onClick={() => setSelectedSuit(suit)} // Automatically select card when suit is clicked
          >
            {suit}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
