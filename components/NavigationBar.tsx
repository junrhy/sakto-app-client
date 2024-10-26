"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';

const NavigationBar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Clinic Management', path: '/clinic-management' },
    { name: 'Rental Items', path: '/rental-items' },
    { name: 'Loan Management', path: '/loan-management' },
    { name: 'Restaurant POS', path: '/restaurant-pos' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-background text-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Multi-Purpose App
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={pathname === item.path ? "default" : "ghost"}
                className="text-sm"
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link href={item.path}>
                  <Button
                    variant={pathname === item.path ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.name}
                  </Button>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavigationBar;
