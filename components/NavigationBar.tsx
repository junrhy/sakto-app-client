"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, CreditCard, ShoppingCart, User, HelpCircle, ChevronDown, LogOut, Package, DollarSign, Building, Users, Stethoscope } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNavigation } from '@/contexts/NavigationContext';

const NavigationBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigationItems } = useNavigation();

  const accountItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: User },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Dashboard': return Home;
      case 'Rental Items': return Package;
      case 'Loan Management': return CreditCard;
      case 'Restaurant POS': return ShoppingCart;
      case 'Payroll': return Users;
      case 'Clinic Management': return Stethoscope;
      default: return null;
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Sakto
        </Link>
        
        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-4 items-center ml-auto">
          {navigationItems.filter(item => item.enabled).map((item) => {
            const Icon = getIcon(item.name);
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    pathname === item.path
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {item.name}
                </Link>
              </li>
            );
          })}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white">
                  Account <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {accountItems.map((item) => (
                  <DropdownMenuItem key={item.name}>
                    <Link href={item.path} className="flex items-center w-full">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col space-y-2">
            {navigationItems.filter(item => item.enabled).map((item) => {
              const Icon = getIcon(item.name);
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      pathname === item.path
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="mr-2 h-5 w-5" />}
                    {item.name}
                  </Link>
                </li>
              );
            })}
            {accountItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 rounded-md text-base font-medium flex items-center bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
