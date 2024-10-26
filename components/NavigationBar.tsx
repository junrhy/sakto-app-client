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
import { useNavigation } from '@/contexts/NavigationContext';

const NavigationBar = () => {
  const pathname = usePathname();
  const { appName, navigationItems, color } = useNavigation();

  const navItems = navigationItems.filter(item => item.enabled);

  return (
    <nav className={`bg-${color}-900 text-${color}-50 p-4 shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          {appName}
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={pathname === item.path ? "default" : "ghost"}
                className={`text-sm ${pathname === item.path ? `bg-${color}-800 hover:bg-${color}-700` : `hover:bg-${color}-800`}`}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className={`border-${color}-50 text-${color}-50`}>
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`bg-${color}-900 text-${color}-50`}>
            {navItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link href={item.path}>
                  <Button
                    variant={pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-start ${pathname === item.path ? `bg-${color}-800 hover:bg-${color}-700` : `hover:bg-${color}-800`}`}
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
