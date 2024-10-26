"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

type NavigationItem = {
  name: string;
  path: string;
  enabled: boolean;
};

type NavigationContextType = {
  navigationItems: NavigationItem[];
  toggleNavItem: (name: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
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
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([
    { name: 'Dashboard', path: '/', enabled: true },
    { name: 'Rental Items', path: '/rental-items', enabled: true },
    { name: 'Loan Management', path: '/loan-management', enabled: true },
    { name: 'Restaurant POS', path: '/restaurant-pos', enabled: true },
    { name: 'Payroll', path: '/payroll', enabled: true },
    { name: 'Clinic Management', path: '/clinic-management', enabled: true }, // New item
  ]);

  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const storedItems = localStorage.getItem('navigationItems');
    if (storedItems) {
      setNavigationItems(JSON.parse(storedItems));
    }

    const storedCurrency = localStorage.getItem('appCurrency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const toggleNavItem = (name: string) => {
    const updatedItems = navigationItems.map(item =>
      item.name === name ? { ...item, enabled: !item.enabled } : item
    );
    setNavigationItems(updatedItems);
    localStorage.setItem('navigationItems', JSON.stringify(updatedItems));
  };

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('appCurrency', newCurrency);
  };

  return (
    <NavigationContext.Provider value={{ navigationItems, toggleNavItem, currency, setCurrency: updateCurrency }}>
      {children}
    </NavigationContext.Provider>
  );
};
