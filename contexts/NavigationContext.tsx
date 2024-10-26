"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

interface NavigationItem {
  id: number;
  name: string;
  path: string;
  enabled: boolean;
}

interface NavigationContextType {
  navigationItems: NavigationItem[];
  updateNavigationItem: (id: number, enabled: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([
    { id: 1, name: 'Home', path: '/', enabled: true },
    { id: 2, name: 'Restaurant POS', path: '/restaurant-pos', enabled: true },
    { id: 3, name: 'POS', path: '/pos', enabled: true },
    { id: 4, name: 'Inventory', path: '/inventory', enabled: true },
    { id: 5, name: 'Rental Items', path: '/rental-items', enabled: true },
    { id: 6, name: 'Loan Management', path: '/loan-management', enabled: true },
    { id: 7, name: 'Help', path: '/help', enabled: true },
    { id: 8, name: 'Rental Properties', path: '/rental-properties', enabled: true },
  ]);

  useEffect(() => {
    const storedItems = localStorage.getItem('navigationItems');
    if (storedItems) {
      setNavigationItems(JSON.parse(storedItems));
    }
  }, []);

  const updateNavigationItem = (id: number, enabled: boolean) => {
    const updatedItems = navigationItems.map(item =>
      item.id === id ? { ...item, enabled } : item
    );
    setNavigationItems(updatedItems);
    localStorage.setItem('navigationItems', JSON.stringify(updatedItems));
  };

  return (
    <NavigationContext.Provider value={{ navigationItems, updateNavigationItem }}>
      {children}
    </NavigationContext.Provider>
  );
};
