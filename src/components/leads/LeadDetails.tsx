
"use client";

import { Business } from '@/lib/types';
import { 
  X, Phone, Globe, MapPin, Star, Clock, 
  ExternalLink, Navigation, 
  ShieldCheck, Info, ImageOff,
  Zap, Package, PhoneCall, TrendingUp, Locate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LeadDetailsProps {
  business: Business;
  onClose: () => void;
}

export function LeadDetails({ business, onClose }: LeadDetailsProps) {
  const intel = business.aiIntelligence;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col sm:max-w-md sm:mx-auto sm:my-8 sm:rounded-3xl sm:shadow-2xl sm:border border-border">
      <div className="relative h-64 shrink-0 overflow-hidden sm:rounded-t-3xl bg-muted flex items-center justify-center">
        {business.photoUrl ? (
          <img 
            src={business.photoUrl} 
            alt={business.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        <div className={cn(
          "flex flex-col items-center justify-center text-muted-foreground",
          business.photoUrl ? "hidden" : ""
        )}>
          <ImageOff size={48} />
          <span className="text-xs uppercase font-bold mt-2">No photo available</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md z-10"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-6 pb-24">
        <div className="space-y-6 -mt-8 relative">
          <div>
            <Badge className="bg-primary text-primary-foreground mb-3 font-bold uppercase tracking-widest text-[10px]">
              {business.googleCategory}
            </Badge>
            <h2 className="font-headline text-2xl font-bold">{business.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-primary font-bold">
                <Star size={16} className="mr-1 fill-current" />
                {business.rating} Rating
              </div>
              <div className="text-muted-foreground text-sm flex items-center">
                <MapPin size={14} className="mr-1" />
                {business.distance}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl" onClick={() => business.phone && window.open(`tel:${business.phone}`)} disabled={!business.phone}>
                <Phone size={18} className="mr-2" /> Call Now
             </Button>
             <Button variant="secondary" className="w-full rounded-xl" onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;
                window.open(url, '_blank');
             }}>
                <Navigation size={18} className="mr-2" /> Navigate
             </Button>
          </div>

          {/* Structured Intelligence Section */}
          <div className="bg-card/50 p-5 rounded-2xl border border-primary/20 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-primary flex items-center font-bold">
                <ShieldCheck size={18} className="mr-2" /> Lead Intelligence
              </h3>
              <Badge variant="outline" className="text-primary border-primary">
                {business.aiConfidence || 0}% Match
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <Package size={10} className="mr-1" /> Bulk Demand
                </div>
                <p className="font-bold text-sm text-foreground">{intel?.bulkDemandLikelihood || "Analyzing..."}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <PhoneCall size={10} className="mr-1" /> Outreach
                </div>
                <p className="font-bold text-sm text-foreground">{intel?.contactability || "Analyzing..."}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <TrendingUp size={10} className="mr-1" /> Ops Signal
                </div>
                <p className="font-bold text-sm text-foreground">{intel?.operationalSignal || "Analyzing..."}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <Locate size={10} className="mr-1" /> Proximity
                </div>
                <p className="font-bold text-sm text-foreground">{intel?.proximitySignal || "Analyzing..."}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">
                <Zap size={10} className="mr-1" /> Strategic Summary
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                "{business.aiReason || 'Evaluating business relevance...'}"
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline font-bold flex items-center text-lg">
              <Info size={18} className="mr-2" /> Location Details
            </h3>
            <div className="grid gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-foreground/80">{business.address}</p>
              </div>
              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-muted-foreground shrink-0" />
                  <a href={business.website} target="_blank" className="text-primary hover:underline flex items-center">
                    Visit Website <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-muted-foreground shrink-0" />
                  <span className="text-foreground/80">{business.phone}</span>
                </div>
              )}
            </div>
          </div>

          {business.openingHours && (
            <div className="space-y-4">
              <h3 className="font-headline font-bold flex items-center text-lg">
                <Clock size={18} className="mr-2" /> Opening Hours
              </h3>
              <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                {business.openingHours.map((line, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground/80">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
