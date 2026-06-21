
"use client";

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadDetails } from '@/components/leads/LeadDetails';
import { Business } from '@/lib/types';
import { getFavorites, toggleFavorite } from '@/lib/store';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Business[]>([]);
  const [selectedLead, setSelectedLead] = useState<Business | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleToggleFavorite = (biz: Business) => {
    const updated = toggleFavorite(biz);
    setFavorites(updated);
  };

  return (
    <div className="pb-32 min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-2">
          <Heart className="text-accent fill-accent" size={24} />
          <h1 className="font-headline text-2xl font-bold tracking-tight">Saved Leads</h1>
        </div>
      </header>

      <main className="px-4 mt-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <Heart size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-xl font-bold">No Saved Leads</h2>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">Save high-value prospects to your watchlist for later follow-up.</p>
            </div>
            <Button asChild className="rounded-2xl h-12 px-8 font-bold bg-primary hover:bg-primary/90">
              <Link href="/">Start Scouting</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((lead) => (
              <LeadCard 
                key={lead.id} 
                business={lead} 
                onSelect={setSelectedLead}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </main>

      {selectedLead && (
        <LeadDetails 
          business={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}

      <BottomNav />
    </div>
  );
}
