"use client"
import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type Color = 'zinc' | 'slate' | 'stone' | 'gray' | 'neutral' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet';

type AppContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  appName: string;
  setAppName: (name: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  color: Color;
  setColor: (color: Color) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useApp must be used within a AppProvider');
    }
    return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('$');
  const [appName, setAppName] = useState('Your Business Name');
  const [theme, setTheme] = useState<Theme>('system');
  const [color, setColor] = useState<Color>('zinc');

  return (
    <AppContext.Provider value={{ 
      currency, 
      setCurrency, 
      appName, 
      setAppName,
      theme,
      setTheme,
      color,
      setColor
    }}>
      {children}
    </AppContext.Provider>
  );
};
