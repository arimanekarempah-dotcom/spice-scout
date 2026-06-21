'use client';

import { Business, Location } from './types';

/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Discovery engine for SpiceScout.
 * Performs a fast search and returns results immediately with basic info.
 */
export async function getNearbyBusinesses(userLocation: Location, radius: number): Promise<Business[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error("Google Maps API Key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.");
  }

  const url = "https://places.googleapis.com/v1/places:searchText";

  const body = {
    textQuery: `spice wholesalers distributors grocery stores near ${userLocation.lat}, ${userLocation.lng}`,
    maxResultCount: 20
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.rating,places.nationalPhoneNumber,places.photos"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Google API error (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  if (!data.places) return [];

  // DEBUG: Log raw first result to check for photos field
  console.log("SEARCH PLACE RAW (First Result):", JSON.stringify(data.places[0], null, 2));

  return data.places.map((place: any) => {
    const bizLat = place.location?.latitude || 0;
    const bizLng = place.location?.longitude || 0;
    const distanceVal = getDistanceKm(userLocation.lat, userLocation.lng, bizLat, bizLng);
    
    let photoUrl = null;
    if (place.photos && place.photos.length > 0) {
      photoUrl = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=400&key=${apiKey}`;
      console.log(`SEARCH PHOTO URL FOUND for ${place.id}:`, photoUrl);
    }

    return {
      id: place.id,
      name: place.displayName?.text || "Unknown Business",
      address: place.formattedAddress || "No address provided",
      phone: place.nationalPhoneNumber || null,
      rating: place.rating || 0,
      photoUrl: photoUrl,
      isOpen: false,
      location: {
        lat: bizLat,
        lng: bizLng
      },
      distance: `${distanceVal.toFixed(1)} km`,
      distanceValue: distanceVal,
      googleCategory: place.primaryType?.replace(/_/g, ' ') || "Business",
    };
  }).filter((biz: any) => biz.distanceValue <= radius)
    .sort((a: any, b: any) => a.distanceValue - b.distanceValue);
}

/**
 * Background Photo Resolver.
 * Strictly resolves Google Place photos. No Street View fallback.
 */
export async function getLeadPhoto(placeId: string, location: Location): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,photos"
      }
    });

    if (response.ok) {
      const details = await response.json();
      console.log(`PLACE DETAILS RAW (${placeId}):`, JSON.stringify(details, null, 2));
      
      if (details.photos && details.photos.length > 0) {
        const photoUrl = `https://places.googleapis.com/v1/${details.photos[0].name}/media?maxWidthPx=400&key=${apiKey}`;
        console.log("FINAL IMAGE URL:", photoUrl);
        return photoUrl;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Place Details photo:", error);
  }

  // Fallback to static placeholder path as requested
  console.log("NO PHOTO FOUND - Returning placeholder path");
  return null; 
}
