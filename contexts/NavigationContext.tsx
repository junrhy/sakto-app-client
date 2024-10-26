"use client"
import React, { createContext, useContext, useState } from 'react';

type NavigationItem = {
  id: string;
  name: string;
  path: string;
  enabled: boolean;
};

type Theme = 'light' | 'dark' | 'system';

type Color = 'zinc' | 'slate' | 'stone' | 'gray' | 'neutral' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet';

type NavigationContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  navigationItems: NavigationItem[];
  updateNavigationItem: (id: string, enabled: boolean) => void;
  appName: string;
  setAppName: (name: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  color: Color;
  setColor: (color: Color) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('$');
  const [appName, setAppName] = useState('Your App Name');
  const [theme, setTheme] = useState<Theme>('system');
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([
    { id: '1', name: 'Dashboard', path: '/', enabled: true },
    { id: '2', name: 'Clinic Management', path: '/clinic-management', enabled: true },
    { id: '3', name: 'Rental Items', path: '/rental-items', enabled: true },
    { id: '4', name: 'Loan Management', path: '/loan-management', enabled: true },
    { id: '5', name: 'Restaurant POS', path: '/restaurant-pos', enabled: true },
    { id: '6', name: 'Warehouse & Distribution', path: '/warehouse-distribution', enabled: true },
    { id: '7', name: 'Trucking Business', path: '/trucking-business', enabled: true },
    { id: '8', name: 'Settings', path: '/settings', enabled: true },
  ]);
  const [color, setColor] = useState<Color>('zinc');

  const updateNavigationItem = (id: string, enabled: boolean) => {
    setNavigationItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, enabled } : item
      )
    );
  };

  return (
    <NavigationContext.Provider value={{ 
      currency, 
      setCurrency, 
      navigationItems, 
      updateNavigationItem, 
      appName, 
      setAppName,
      theme,
      setTheme,
      color,
      setColor
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
