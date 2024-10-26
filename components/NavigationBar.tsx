"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react';

const NavigationBar = () => {
  const pathname = usePathname();
  const { navigationItems, appName } = useNavigation();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {appName}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navigationItems
              .filter(item => item.enabled)
              .map((item) => (
                <DropdownMenuItem key={item.id} asChild>
                  <Link 
                    href={item.path} 
                    className={pathname === item.path ? 'font-bold' : ''}
                  >
                    {item.name}
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
