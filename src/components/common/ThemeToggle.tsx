import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/slices/themeSlice';

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 h-5 w-5 text-yellow-500 transition-all duration-300 ${
            mode === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-5 w-5 text-blue-400 transition-all duration-300 ${
            mode === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;