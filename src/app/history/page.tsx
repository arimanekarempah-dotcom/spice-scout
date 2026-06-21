
"use client";

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchSession } from '@/lib/types';
import { getSearchHistory } from '@/lib/store';
import { History, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchSession[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  return (
    <div className="pb-32 min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-2">
          <History className="text-primary" size={24} />
          <h1 className="font-headline text-2xl font-bold tracking-tight">Search History</h1>
        </div>
      </header>

      <main className="px-4 mt-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <History size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-xl font-bold">No History Yet</h2>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">Your recent prospecting sessions will appear here.</p>
            </div>
            <Button asChild className="rounded-2xl h-12 px-8 font-bold bg-primary hover:bg-primary/90">
              <Link href="/">Discover Nearby</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((session) => (
              <div 
                key={session.id} 
                className="bg-card p-5 rounded-2xl border border-border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-bold text-primary uppercase tracking-widest">
                    <Calendar size={14} className="mr-2" />
                    {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="font-headline font-bold text-lg">
                    {session.leadsCount} Prospects Found
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" />
                    Radius: {session.radius} km • {session.location.lat.toFixed(2)}, {session.location.lng.toFixed(2)}
                  </div>
                </div>
                <div className="bg-muted p-2 rounded-full group-hover:bg-primary group-hover:text-background transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
