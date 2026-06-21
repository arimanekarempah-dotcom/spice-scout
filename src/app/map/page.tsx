
"use client";

import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sparkles, MapPin, AlertCircle } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col pb-16 sm:pb-20">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary" size={24} />
          <h1 className="font-headline text-2xl font-bold tracking-tight">Lead Map</h1>
        </div>
      </header>

      <main className="flex-1 relative bg-muted/20 flex items-center justify-center p-8 text-center">
        <div className="max-w-xs space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <AlertCircle size={32} />
          </div>
          <h2 className="font-headline text-lg font-bold">Map Visualization</h2>
          <p className="text-muted-foreground text-sm">
            Interactive map integration requires a valid Google Maps SDK Key. 
            All discovered leads will be visualized here with 1-tap card access.
          </p>
        </div>
        
        {/* Placeholder for Vis.GL implementation */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
