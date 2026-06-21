
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Map as MapIcon, Heart, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Search', icon: Search, href: '/' },
  { label: 'Map', icon: MapIcon, href: '/map' },
  { label: 'Favorites', icon: Heart, href: '/favorites' },
  { label: 'History', icon: History, href: '/history' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 pb-safe pt-2 z-50 flex justify-around items-center h-16 sm:h-20">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-1 rounded-full transition-all duration-300",
              isActive ? "bg-primary/10 scale-110" : ""
            )}>
              <Icon size={20} className={cn(isActive ? "fill-primary/20" : "")} />
            </div>
            <span className="text-[10px] font-medium tracking-tight uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
