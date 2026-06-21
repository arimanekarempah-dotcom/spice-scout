
export interface Location {
  lat: number;
  lng: number;
}

export interface LeadIntelligence {
  businessType: string;
  bulkDemandLikelihood: string;
  contactability: string;
  operationalSignal: string;
  proximitySignal: string;
  leadSummary: string;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating: number;
  photoUrl: string | null;
  isOpen: boolean;
  location: Location;
  distance: string;
  googleCategory: string;
  description?: string;
  reviews?: string;
  openingHours?: string[];
  
  // AI fields
  aiConfidence?: number;
  aiReason?: string;
  aiBusinessType?: string;
  aiIntelligence?: LeadIntelligence;
  
  isFavorite?: boolean;
}

export interface SearchSession {
  id: string;
  date: string;
  location: Location;
  radius: number;
  leadsCount: number;
}
