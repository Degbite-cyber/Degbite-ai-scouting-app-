export type PipelineStage =
  | 'Discovered'
  | 'Qualified'
  | 'Contact Research'
  | 'Ready for Outreach'
  | 'Contacted'
  | 'Replied'
  | 'Interested'
  | 'Meeting Booked'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost';

export type SignalCategory =
  | 'explicit_request'
  | 'strong_need'
  | 'indirect_opportunity'
  | 'general_fit'
  | 'insufficient_evidence';

export type ContactVerificationStatus =
  | 'verified'
  | 'provider_reported'
  | 'unverified'
  | 'unavailable';

export interface Organization {
  id: string;
  name: string;
  normalizedDomain: string;
  website: string;
  industry: string;
  country: string;
  city?: string;
  companySize: string;
  description?: string;
  linkedinUrl?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email?: string;
  linkedinUrl?: string;
  verificationStatus: ContactVerificationStatus;
  verificationSource?: string;
  isDemo: boolean;
}

export interface BuyingSignal {
  id: string;
  organizationId: string;
  signalCategory: SignalCategory;
  evidenceSummary: string;
  sourceUrl?: string;
  sourceName?: string;
  originalPublishedDate?: string;
  lastVerifiedAt: string;
  confidenceLevel: number;
  freshnessStatus: 'fresh' | 'aging' | 'expired' | 'needs_review';
  isDemo: boolean;
}

export interface QualificationScore {
  id: string;
  leadId: string;
  totalScore: number; // 0-100
  classification: 'High Priority' | 'Worth Investigating' | 'Low Priority';
  breakdown: {
    signalStrength: number; // Max 35
    relevance: number;      // Max 25
    contactConfidence: number; // Max 15
    commercialFit: number;  // Max 15
    freshness: number;      // Max 10
  };
  explanation: string;
  confidence: number;
  modelVersion: string;
  evaluatedAt: string;
}

export interface Lead {
  id: string;
  organization: Organization;
  contact?: Contact;
  signal?: BuyingSignal;
  score?: QualificationScore;
  pipelineStage: PipelineStage;
  recommendedService: string;
  recommendedNextAction: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OutreachDraft {
  id: string;
  leadId: string;
  channel: 'email' | 'linkedin' | 'follow_up';
  tone: 'professional' | 'friendly' | 'direct' | 'consultative';
  subject?: string;
  body: string;
  valueProposition: string;
  suggestedOffer: string;
  isApproved: boolean;
  approvedAt?: string;
}
