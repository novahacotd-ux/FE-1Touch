import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('lightMode');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('lightMode', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const setDark = () => setTheme('dark');
  const setLight = () => setTheme('light');

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setDark, setLight }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
