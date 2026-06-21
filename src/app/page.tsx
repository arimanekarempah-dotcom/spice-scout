
"use client";

import { useState, useEffect, useCallback } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadDetails } from '@/components/leads/LeadDetails';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { Location, Business } from '@/lib/types';
import { getNearbyBusinesses, getLeadPhoto } from '@/lib/google-places';
import { toggleFavorite, getFavorites, addToHistory } from '@/lib/store';
import { categorizeBusinessRelevance } from '@/ai/flows/ai-categorize-business-relevance';
import { exportLeadsToCsv } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Search as SearchIcon, 
  Filter, 
  Navigation, 
  Download, 
  RefreshCw,
  Loader2,
  MapPin,
  Sparkles,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Home() {
  const { toast } = useToast();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Business[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Business[]>([]);
  const [selectedLead, setSelectedLead] = useState<Business | null>(null);
  const [favorites, setFavorites] = useState<Business[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasRunSearch, setHasRunSearch] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const [filters, setFilters] = useState({
    radius: 5,
    minRating: 0,
    minConfidence: 70,
    types: [] as string[],
    openNow: false,
  });

  useEffect(() => {
    setFavorites(getFavorites());
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const detectLocation = useCallback(() => {
    setIsLocating(true);
    setApiError(null);
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        toast({ title: "Location detected", description: "GPS coordinates active." });
      },
      () => {
        toast({ title: "Error", description: "Please enable GPS permissions", variant: "destructive" });
        setIsLocating(false);
      }
    );
  }, [toast]);

  const runDiscovery = useCallback(async () => {
    if (!location) {
      detectLocation();
      return;
    }

    setIsSearching(true);
    setHasRunSearch(true);
    setApiError(null);

    try {
      const basicLeads = await getNearbyBusinesses(location, filters.radius);
      setLeads(basicLeads);
      setIsSearching(false);

      if (basicLeads.length === 0) return;

      addToHistory({
        id: `search-${Date.now()}`,
        date: new Date().toISOString(),
        location,
        radius: filters.radius,
        leadsCount: basicLeads.length
      });

      toast({ 
        title: "Leads Found", 
        description: `Discovery successful. Resolving intelligence...` 
      });

      // Background Enrichment
      basicLeads.forEach((biz) => {
        // Intelligence Analysis
        categorizeBusinessRelevance({
          businessName: biz.name,
          googleCategory: biz.googleCategory,
          address: biz.address,
          rating: biz.rating,
          phone: biz.phone,
          distance: biz.distance,
        }).then((result) => {
          setLeads(prev => prev.map(l => l.id === biz.id ? {
            ...l,
            aiConfidence: result.confidenceScore,
            aiReason: result.reason,
            aiBusinessType: result.businessType,
            aiIntelligence: result.intelligence
          } : l));
        });

        // Photo Resolution
        if (!biz.photoUrl) {
          getLeadPhoto(biz.id, biz.location).then((photoUrl) => {
            if (photoUrl) {
              setLeads(prev => prev.map(l => l.id === biz.id ? { ...l, photoUrl } : l));
            }
          });
        }
      });

    } catch (error: any) {
      const message = error.message || "An unexpected error occurred.";
      setApiError(message);
      toast({ 
        title: "Search Error", 
        description: message, 
        variant: "destructive" 
      });
      setIsSearching(false);
    }
  }, [location, filters.radius, detectLocation, toast]);

  useEffect(() => {
    let result = leads;
    
    if (searchTerm) {
      result = result.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.googleCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.minRating > 0) result = result.filter(l => l.rating >= filters.minRating);
    if (filters.openNow) result = result.filter(l => l.isOpen);
    
    setFilteredLeads(result);
  }, [leads, filters, searchTerm]);

  const handleToggleFavorite = (biz: Business) => {
    const updated = toggleFavorite(biz);
    setFavorites(updated);
  };

  const getActivationUrl = (errorMsg: string) => {
    const match = errorMsg.match(/https?:\/\/console\.developers\.google\.com\/[^\s]+/);
    return match ? match[0] : null;
  };

  if (showSplash) {
    const splashImg = PlaceHolderImages.find(img => img.id === 'splash-bg')?.imageUrl || "https://picsum.photos/seed/spice/1080/1920";
    return (
      <div className="fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src={splashImg} 
            alt="Spice Market" 
            fill 
            className="object-cover"
            data-ai-hint="exotic spices market"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
            <Sparkles size={48} className="text-background" />
          </div>
          <div className="space-y-2">
            <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary">SpiceScout</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">Verified Sales Lead Finder</p>
          </div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={24} />
            <h1 className="font-headline text-2xl font-bold tracking-tight">SpiceScout</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full border-border bg-card" 
              onClick={() => exportLeadsToCsv(filteredLeads)}
              disabled={filteredLeads.length === 0}
            >
              <Download size={20} />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full border-border bg-card" 
              onClick={detectLocation}
              disabled={isLocating}
            >
              <Navigation size={20} className={cn(isLocating && "animate-pulse")} />
            </Button>
          </div>
        </div>

        {(apiError || !hasApiKey) && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">
              {!hasApiKey ? "Setup Required" : "API Configuration Error"}
            </AlertTitle>
            <AlertDescription className="text-xs space-y-2">
              <p>{apiError || "Add your Google Maps API Key to the environment variables to discover real businesses."}</p>
              {apiError && getActivationUrl(apiError) && (
                <Button asChild variant="link" size="sm" className="p-0 h-auto text-destructive underline font-bold">
                  <a href={getActivationUrl(apiError)!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Click here to enable the Places API <ExternalLink size={12} />
                  </a>
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search verified businesses..." 
              className="pl-10 h-12 rounded-2xl border-border bg-card shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="h-12 w-12 rounded-2xl border-border bg-card shrink-0">
                <Filter size={20} />
              </Button>
            </SheetTrigger>
            <LeadFilters 
              filters={filters} 
              onChange={setFilters} 
              onApply={() => {}} 
            />
          </Sheet>
        </div>
      </header>

      <main className="px-4 mt-6">
        {!location ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <MapPin size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-xl font-bold">Location Required</h2>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">Detect your GPS location to find real businesses within {filters.radius}km.</p>
            </div>
            <Button onClick={detectLocation} className="rounded-2xl h-12 px-8 font-bold text-base shadow-xl shadow-primary/20">
              <Navigation size={18} className="mr-2" /> Detect Location
            </Button>
          </div>
        ) : hasRunSearch && leads.length === 0 && !isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="font-headline text-xl font-bold">No nearby businesses found.</h2>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm mt-2">
                Try increasing your search radius in the filter settings.
              </p>
            </div>
            <Button onClick={runDiscovery} variant="outline" className="rounded-2xl h-12 px-8 font-bold">
              Try Again
            </Button>
          </div>
        ) : leads.length === 0 && !isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <SearchIcon size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-xl font-bold">Verified Leads Only</h2>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">Fetching 100% real data for grocery stores and wholesalers directly from Google.</p>
            </div>
            <Button onClick={runDiscovery} className="rounded-2xl h-14 px-10 font-bold text-lg shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90">
              Run AI Scout
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-lg font-bold flex items-center">
                Found {filteredLeads.length} Verified Leads
                {isSearching && <Loader2 className="ml-2 animate-spin text-primary" size={18} />}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={runDiscovery} 
                className="text-primary hover:text-primary font-bold"
                disabled={isSearching}
              >
                <RefreshCw size={14} className={cn("mr-1", isSearching && "animate-spin")} /> 
                Refresh
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map((lead) => (
                <LeadCard 
                  key={lead.id} 
                  business={lead} 
                  onSelect={(b) => setSelectedLead(b)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.some(f => f.id === lead.id)}
                />
              ))}
              {isSearching && (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card h-80 rounded-2xl animate-pulse" />
                  ))}
                </>
              )}
            </div>
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
