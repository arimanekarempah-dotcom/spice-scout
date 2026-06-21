"use client";

import { Business } from '@/lib/types';
import { 
  Phone, 
  Navigation, 
  MapPin, 
  Share2, 
  Heart, 
  Star, 
  Clock, 
  ShieldCheck,
  Globe,
  ImageOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  business: Business;
  onSelect: (business: Business) => void;
  onToggleFavorite: (business: Business) => void;
  isFavorite: boolean;
}

export function LeadCard({ business, onSelect, onToggleFavorite, isFavorite }: LeadCardProps) {
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.phone) window.open(`tel:${business.phone}`);
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;
    window.open(url, '_blank');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out this potential lead: ${business.name}`,
        url: business.website || `https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`
      });
    }
  };

  return (
    <div 
      onClick={() => onSelect(business)}
      className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all cursor-pointer group shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted flex items-center justify-center">
        {business.photoUrl ? (
          <img 
            src={business.photoUrl} 
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // If the specific Google photo fails, hide it and show placeholder
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        <div className={cn(
          "flex flex-col items-center justify-center text-muted-foreground",
          business.photoUrl ? "hidden" : ""
        )}>
          <ImageOff size={32} />
          <span className="text-[10px] uppercase font-bold mt-1">No photo available</span>
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {business.aiConfidence !== undefined && (
            <Badge className={cn(
              "font-bold text-xs shadow-md border-none",
              business.aiConfidence > 90 ? "bg-green-600 text-white" : "bg-primary text-primary-foreground"
            )}>
              <ShieldCheck size={12} className="mr-1" />
              {business.aiConfidence}% Score
            </Badge>
          )}
          <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-none text-[10px] uppercase">
            {business.googleCategory}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 border-none transition-colors",
            isFavorite ? "text-accent" : "text-white"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(business);
          }}
        >
          <Heart size={20} className={isFavorite ? "fill-current" : ""} />
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline text-lg font-bold line-clamp-1">{business.name}</h3>
            <div className="flex items-center text-muted-foreground text-xs mt-1">
              <MapPin size={12} className="mr-1 shrink-0" />
              <span className="line-clamp-1">{business.address}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center text-primary font-bold">
              <Star size={14} className="mr-1 fill-current" />
              <span>{business.rating}</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{business.distance}</div>
          </div>
        </div>

        {business.aiReason && (
          <p className="text-xs text-muted-foreground italic line-clamp-2 leading-relaxed bg-muted/30 p-2 rounded-lg">
            &ldquo;{business.aiReason}&rdquo;
          </p>
        )}

        <div className="flex items-center gap-4 text-xs pt-1">
          <div className={cn("flex items-center font-medium", business.isOpen ? "text-green-500" : "text-destructive")}>
            <Clock size={12} className="mr-1" />
            {business.isOpen ? "Open Now" : "Closed"}
          </div>
          {business.website && (
            <div className="flex items-center text-primary font-medium">
              <Globe size={12} className="mr-1" />
              Website
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/30">
          <Button variant="secondary" size="sm" className="h-9 px-0" onClick={handleCall} disabled={!business.phone}>
            <Phone size={16} />
          </Button>
          <Button variant="secondary" size="sm" className="h-9 px-0" onClick={handleNavigate}>
            <Navigation size={16} />
          </Button>
          <Button variant="secondary" size="sm" className="h-9 px-1" onClick={(e) => {
            e.stopPropagation();
            window.open(`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`, '_blank');
          }}>
            <MapPin size={16} />
          </Button>
          <Button variant="secondary" size="sm" className="h-9 px-0" onClick={handleShare}>
            <Share2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
