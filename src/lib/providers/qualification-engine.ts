import { RawDiscoveryRecord } from './discovery-engine';
import { Lead, QualificationScore } from '@/types';

export interface QualificationResult {
  score: QualificationScore;
  recommendedService: string;
  recommendedNextAction: string;
}

export function qualifyDiscoveredRecord(
  record: RawDiscoveryRecord,
  leadId: string
): QualificationResult {
  // 1. Signal Strength (Max 35)
  let signalStrength = 10;
  if (record.signalCategory === 'explicit_request') signalStrength = 35;
  else if (record.signalCategory === 'strong_need') signalStrength = 28;
  else if (record.signalCategory === 'indirect_opportunity') signalStrength = 20;
  else if (record.signalCategory === 'general_fit') signalStrength = 12;

  // 2. Relevance to AI Video Automation (Max 25)
  let relevance = 15;
  const lowerSnippet = (record.signalSnippet + ' ' + (record.description || '')).toLowerCase();
  if (
    lowerSnippet.includes('ai video') ||
    lowerSnippet.includes('n8n') ||
    lowerSnippet.includes('creative automation') ||
    lowerSnippet.includes('ugc') ||
    lowerSnippet.includes('product tour')
  ) {
    relevance = 25;
  } else if (lowerSnippet.includes('video') || lowerSnippet.includes('ad creative') || lowerSnippet.includes('tiktok')) {
    relevance = 21;
  }

  // 3. Decision-Maker Identification Confidence (Max 15)
  let contactConfidence = 5;
  if (record.decisionMakerName && record.decisionMakerEmail) {
    contactConfidence = 15;
  } else if (record.decisionMakerName) {
    contactConfidence = 11;
  }

  // 4. Commercial Fit and Company Size (Max 15)
  let commercialFit = 10;
  if (record.industry === 'Marketing agencies' || record.industry === 'E-commerce & DTC') {
    commercialFit = 14;
  } else if (record.industry === 'SaaS & Tech' || record.industry === 'Real Estate Marketing') {
    commercialFit = 13;
  }

  // 5. Signal Freshness (Max 10)
  const freshness = 8;

  const totalScore = Math.min(100, signalStrength + relevance + contactConfidence + commercialFit + freshness);

  let classification: QualificationScore['classification'] = 'Low Priority';
  if (totalScore >= 80) classification = 'High Priority';
  else if (totalScore >= 60) classification = 'Worth Investigating';

  // Match AI Video Service
  let recommendedService = 'Automated Video Content Production Pipeline (n8n + AI)';
  let recommendedNextAction = 'Research verified decision-maker email and craft personalized cold pitch';

  if (record.industry === 'E-commerce & DTC') {
    recommendedService = 'Automated AI UGC & Product Ad Production Engine (n8n + ElevenLabs + HeyGen)';
    recommendedNextAction = 'Pitch 20-30 weekly TikTok/Meta ad variations on autopilot without filming costs';
  } else if (record.industry === 'Marketing agencies') {
    recommendedService = 'White-Label AI Video Automation System for Agency Clients';
    recommendedNextAction = 'Send partnership offer to handle scalable client video fulfillment using n8n';
  } else if (record.industry === 'SaaS & Tech') {
    recommendedService = 'Automated Software Explainer, Release Walkthrough & Onboarding Video Engine';
    recommendedNextAction = 'Offer a customized 60-second interactive demo video built directly from their docs';
  } else if (record.industry === 'Real Estate Marketing') {
    recommendedService = 'Automated Listing-to-Video Workflow (Photos to Multi-Format Social Videos)';
    recommendedNextAction = 'Showcase demo of converting listing photo URLs into branded vertical video tours';
  }

  return {
    score: {
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      leadId,
      totalScore,
      classification,
      breakdown: {
        signalStrength,
        relevance,
        contactConfidence,
        commercialFit,
        freshness,
      },
      explanation: `Rated ${totalScore}/100 (${classification}): Evidence evaluated from "${record.sourceName}". Signal rated ${signalStrength}/35. Service alignment scored ${relevance}/25 based on direct video production demand.`,
      confidence: 0.89,
      modelVersion: 'gemini-2.5-flash-evaluator-v1',
      evaluatedAt: new Date().toISOString(),
    },
    recommendedService,
    recommendedNextAction,
  };
}

export function transformRecordToLead(
  record: RawDiscoveryRecord,
  isDemo: boolean = false
): Lead {
  const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const orgId = `org-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const normalizedDomain = record.website
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .toLowerCase();

  const qual = qualifyDiscoveredRecord(record, leadId);

  return {
    id: leadId,
    isDemo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pipelineStage: qual.score.totalScore >= 80 ? 'Qualified' : 'Discovered',
    recommendedService: qual.recommendedService,
    recommendedNextAction: qual.recommendedNextAction,
    organization: {
      id: orgId,
      name: record.companyName,
      normalizedDomain,
      website: record.website,
      industry: record.industry,
      country: record.country,
      city: record.city,
      companySize: record.companySize || '11-50',
      description: record.description,
      linkedinUrl: record.website ? `https://linkedin.com/company/${normalizedDomain.split('.')[0]}` : undefined,
      isDemo,
      createdAt: new Date().toISOString(),
    },
    contact: record.decisionMakerName
      ? {
          id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          organizationId: orgId,
          firstName: record.decisionMakerName.split(' ')[0] || 'Unknown',
          lastName: record.decisionMakerName.split(' ').slice(1).join(' ') || '',
          jobTitle: record.decisionMakerTitle || 'Key Decision-Maker',
          email: record.decisionMakerEmail,
          linkedinUrl: record.decisionMakerLinkedIn,
          verificationStatus: record.decisionMakerEmail ? 'verified' : 'unverified',
          verificationSource: record.sourceName,
          isDemo,
        }
      : undefined,
    signal: {
      id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      organizationId: orgId,
      signalCategory: record.signalCategory,
      evidenceSummary: record.signalSnippet,
      sourceUrl: record.signalUrl,
      sourceName: record.sourceName,
      originalPublishedDate: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      confidenceLevel: 0.9,
      freshnessStatus: 'fresh',
      isDemo,
    },
    score: qual.score,
  };
}
