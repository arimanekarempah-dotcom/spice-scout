"use client";

import { CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface Filters {
  radius: number;
  minRating: number;
  minConfidence: number;
  types: string[];
  openNow: boolean;
}

interface LeadFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onApply: () => void;
}

export function LeadFilters({ filters, onChange, onApply }: LeadFiltersProps) {
  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: newTypes });
  };

  return (
    <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] p-0 overflow-hidden bg-background">
      <div className="flex flex-col h-full">
        <SheetHeader className="p-6 pb-2 shrink-0">
          <SheetTitle className="font-headline text-2xl font-bold">Search Filters</SheetTitle>
          <SheetDescription>Refine your sales lead prospecting</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Search Radius</Label>
              <span className="text-primary font-bold">{filters.radius} km</span>
            </div>
            <Slider
              value={[filters.radius]}
              max={10}
              min={1}
              step={1}
              onValueChange={([val]) => onChange({ ...filters, radius: val })}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
              <span>1 KM</span>
              <span>5 KM</span>
              <span>10 KM</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Business Type</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((type) => (
                <Badge
                  key={type}
                  variant={filters.types.includes(type) ? "default" : "outline"}
                  className="cursor-pointer px-4 py-1.5 rounded-full"
                  onClick={() => toggleType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Min Rating</Label>
              <Select 
                value={filters.minRating.toString()} 
                onValueChange={(val) => onChange({ ...filters, minRating: parseFloat(val) })}
              >
                <SelectTrigger className="rounded-xl border-border bg-card">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="3">3.0+</SelectItem>
                  <SelectItem value="4">4.0+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Min Confidence</Label>
              <Select 
                value={filters.minConfidence.toString()} 
                onValueChange={(val) => onChange({ ...filters, minConfidence: parseInt(val) })}
              >
                <SelectTrigger className="rounded-xl border-border bg-card">
                  <SelectValue placeholder="AI Confidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">70% (Pro)</SelectItem>
                  <SelectItem value="80">80% (High)</SelectItem>
                  <SelectItem value="90">90% (Elite)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-card p-4 rounded-2xl border border-border">
            <Checkbox 
              id="openNow" 
              checked={filters.openNow} 
              onCheckedChange={(val) => onChange({ ...filters, openNow: !!val })} 
            />
            <Label htmlFor="openNow" className="font-bold cursor-pointer">Only show businesses open now</Label>
          </div>
        </div>

        <div className="p-6 pt-2 shrink-0">
          <Button className="w-full h-14 font-bold text-lg rounded-2xl shadow-xl shadow-primary/20" onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}

function Badge({ children, variant = "default", className, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/80" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
