
'use server';
/**
 * @fileOverview A B2B lead qualification AI agent for spice sales.
 * 
 * Provides structured lead intelligence for spice wholesalers.
 * Features a high-fidelity fallback for quota-limited scenarios.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { LeadIntelligence } from '@/lib/types';

const CategorizeBusinessRelevanceInputSchema = z.object({
  businessName: z.string(),
  googleCategory: z.string(),
  address: z.string(),
  rating: z.number().optional(),
  phone: z.string().optional().nullable(),
  distance: z.string().optional(),
});
export type CategorizeBusinessRelevanceInput = z.infer<typeof CategorizeBusinessRelevanceInputSchema>;

const LeadIntelligenceSchema = z.object({
  businessType: z.string().describe('Categorization of the business entity'),
  bulkDemandLikelihood: z.string().describe('High | Medium-High | Medium | Low'),
  contactability: z.string().describe('Direct | Inferred | Difficult'),
  operationalSignal: z.string().describe('Strong | Standard | Emerging'),
  proximitySignal: z.string().describe('Local | Regional'),
  leadSummary: z.string().describe('Detailed explanation of actual sales potential for bulk spices'),
});

const CategorizeBusinessRelevanceOutputSchema = z.object({
  targeting: z.enum(['High', 'Medium', 'Low']).describe('Targeting level for outreach'),
  confidenceScore: z.number().describe('Score from 0 to 100'),
  intelligence: LeadIntelligenceSchema,
});
export type CategorizeBusinessRelevanceOutput = z.infer<typeof CategorizeBusinessRelevanceOutputSchema>;

export interface LeadAnalysisResult {
  confidenceScore: number;
  reason: string;
  businessType: string;
  intelligence: LeadIntelligence;
}

const prompt = ai.definePrompt({
  name: 'categorizeBusinessRelevancePrompt',
  input: { schema: CategorizeBusinessRelevanceInputSchema },
  output: { schema: CategorizeBusinessRelevanceOutputSchema },
  prompt: `You are a B2B lead qualification analyst for a spice wholesaler.

Analyze this business prospect:

Name: {{{businessName}}}
Type: {{{googleCategory}}}
Rating: {{{rating}}}
Address: {{{address}}}
Phone Available: {{#if phone}}Yes{{else}}No{{/if}}
Distance: {{{distance}}}

Return JSON only:
{
  "targeting": "High / Medium / Low",
  "confidenceScore": number (0-100),
  "intelligence": {
    "businessType": "String description",
    "bulkDemandLikelihood": "High | Medium-High | Medium | Low",
    "contactability": "Direct | Inferred",
    "operationalSignal": "Strong | Standard",
    "proximitySignal": "Local | Regional",
    "leadSummary": "3-5 sentences explaining actual sales potential. Avoid generic wording."
  }
}

Focus on:
* Likelihood of needing bulk spices (wholesalers, grocery stores, restaurant suppliers)
* Business legitimacy and traffic (based on rating and type)
* Operational scale (small shop vs. large distributor)
* Accessibility for outreach

Make the reasoning detailed and practical, not generic.`,
});

const analysisFlow = ai.defineFlow(
  {
    name: 'categorizeBusinessRelevanceFlow',
    inputSchema: CategorizeBusinessRelevanceInputSchema,
    outputSchema: CategorizeBusinessRelevanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate lead analysis.');
    return output;
  }
);

export async function categorizeBusinessRelevance(
  input: CategorizeBusinessRelevanceInput
): Promise<LeadAnalysisResult> {
  try {
    const result = await analysisFlow(input);
    
    return {
      confidenceScore: result.confidenceScore,
      reason: result.intelligence.leadSummary,
      businessType: `${result.targeting} Priority`,
      intelligence: result.intelligence,
    };
  } catch (error: any) {
    console.warn('GEMINI UNAVAILABLE (Hybrid Fallback Triggered):', error.message || error);
    
    // Heuristic Fallback Logic
    const cat = (input.googleCategory || "").toLowerCase();
    const name = (input.businessName || "").toLowerCase();
    const isWholesaler = cat.includes('wholesaler') || cat.includes('distributor') || name.includes('wholesaler');
    const isGrocery = cat.includes('grocery') || cat.includes('market') || cat.includes('store');
    
    const score = 
      (input.rating ?? 3) * 15 + 
      (input.phone ? 15 : 0) + 
      (isWholesaler ? 25 : 0) +
      (isGrocery ? 15 : 0);

    const targeting = 
      score >= 85 ? 'High' : 
      score >= 60 ? 'Medium' : 
      'Low';

    const distVal = parseFloat(input.distance || "0");

    const intelligence: LeadIntelligence = {
      businessType: input.googleCategory,
      bulkDemandLikelihood: isWholesaler ? "High" : isGrocery ? "Medium-High" : "Low",
      contactability: input.phone ? "Direct" : "Inferred",
      operationalSignal: (input.rating || 0) >= 4.5 ? "Strong" : "Standard",
      proximitySignal: distVal <= 5 ? "Local" : "Regional",
      leadSummary: `${input.googleCategory} with ${input.rating ?? "unknown"}★ rating. ${input.phone ? "Direct contact available via phone." : "No direct phone listed."} Based on business type, bulk spice demand is likely ${isWholesaler ? "high" : "moderate"}. (Heuristic Profile)`
    };

    return {
      confidenceScore: Math.min(score, 100),
      reason: intelligence.leadSummary,
      businessType: `${targeting} Priority`,
      intelligence
    };
  }
}
