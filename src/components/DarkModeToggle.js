import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleDarkMode} 
      className="dark-mode-toggle"
      aria-label="Toggle dark mode"
    >
      {darkMode ? '☀️' : '🌑'}
    </button>
  );
};

export default DarkModeToggle;