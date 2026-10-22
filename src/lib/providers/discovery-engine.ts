import { Lead, SignalCategory } from '@/types';

export interface DiscoverySearchParams {
  industries: string[];
  countries: string[];
  companySizes: string[];
  keywords: string[];
  provider: 'mock_sandbox' | 'csv_import' | 'serper_web' | 'apollo';
  isDemo?: boolean;
}

export interface RawDiscoveryRecord {
  companyName: string;
  website: string;
  industry: string;
  country: string;
  city?: string;
  companySize?: string;
  description?: string;
  decisionMakerName?: string;
  decisionMakerTitle?: string;
  decisionMakerEmail?: string;
  decisionMakerLinkedIn?: string;
  signalSnippet: string;
  signalCategory: SignalCategory;
  signalUrl?: string;
  sourceName: string;
}

export interface DiscoveryProvider {
  name: string;
  isAvailable(): boolean;
  search(params: DiscoverySearchParams): Promise<RawDiscoveryRecord[]>;
}

export class MockSandboxProvider implements DiscoveryProvider {
  name = 'mock_sandbox';

  isAvailable(): boolean {
    return true;
  }

  async search(params: DiscoverySearchParams): Promise<RawDiscoveryRecord[]> {
    // Deterministic, realistic simulated live candidates matching query parameters
    const candidates: RawDiscoveryRecord[] = [
      {
        companyName: 'LuxeGlow Cosmetics',
        website: 'https://luxeglowbeauty.com',
        industry: 'E-commerce & DTC',
        country: 'United States',
        city: 'Los Angeles, CA',
        companySize: '11-50',
        description: 'Direct-to-consumer clean skincare brand scaling TikTok & Meta creative volume.',
        decisionMakerName: 'Jessica Miller',
        decisionMakerTitle: 'VP of Growth & Acquisition',
        decisionMakerEmail: 'jessica.m@luxeglowbeauty.com',
        decisionMakerLinkedIn: 'https://linkedin.com/in/jessica-miller-growth',
        signalSnippet:
          'Public Job Notice: Seeking AI Video Production partner or Lead to generate 20+ UGC and product demonstration ad creatives per week.',
        signalCategory: 'explicit_request',
        signalUrl: 'https://boards.greenhouse.io/luxeglow/jobs/928192',
        sourceName: 'Greenhouse Career Board',
      },
      {
        companyName: 'StackFlow Automation',
        website: 'https://stackflowhq.com',
        industry: 'SaaS & Tech',
        country: 'United Kingdom',
        city: 'London',
        companySize: '11-50',
        description: 'Workflow management software for remote digital agencies.',
        decisionMakerName: 'David Vance',
        decisionMakerTitle: 'Head of Product Marketing',
        decisionMakerEmail: 'vance@stackflowhq.com',
        decisionMakerLinkedIn: 'https://linkedin.com/in/david-vance-saas',
        signalSnippet:
          'Press RFP: Launching v3.0 platform; requesting vendor pitches for 12 interactive product tour videos & onboarding modules.',
        signalCategory: 'strong_need',
        signalUrl: 'https://stackflowhq.com/press/v3-launch-rfp',
        sourceName: 'Company Press & Vendor RFP',
      },
      {
        companyName: 'Apex Media Growth',
        website: 'https://apexmediagrowth.com',
        industry: 'Marketing agencies',
        country: 'Australia',
        city: 'Sydney',
        companySize: '1-10',
        description: 'Performance marketing agency managing paid ads for 25+ e-commerce clients.',
        decisionMakerName: 'Liam Carter',
        decisionMakerTitle: 'Founder & Managing Director',
        decisionMakerEmail: 'liam@apexmediagrowth.com',
        decisionMakerLinkedIn: 'https://linkedin.com/in/liam-carter-agency',
        signalSnippet:
          'Public post seeking white-label video automation partner using n8n or Make.com to batch produce client ad creatives.',
        signalCategory: 'explicit_request',
        signalUrl: 'https://twitter.com/liam_apex/status/189201948',
        sourceName: 'Public Founder Post / Social Feed',
      },
      {
        companyName: 'Skyline Capital Properties',
        website: 'https://skylinecapitaluae.com',
        industry: 'Real Estate Marketing',
        country: 'United Arab Emirates',
        city: 'Dubai',
        companySize: '11-50',
        description: 'Ultra-prime residential property brokerage in Dubai Marina and Palm Jumeirah.',
        decisionMakerName: 'Tariq Al-Mansoor',
        decisionMakerTitle: 'Managing Partner',
        decisionMakerEmail: 'tariq@skylinecapitaluae.com',
        decisionMakerLinkedIn: 'https://linkedin.com/in/tariq-al-mansoor-dubai',
        signalSnippet:
          'Company newsletter announcing automated listing video rollout for 50+ luxury penthouse listings.',
        signalCategory: 'indirect_opportunity',
        signalUrl: 'https://skylinecapitaluae.com/news/listing-media-expansion',
        sourceName: 'Official Brokerage Media Feed',
      },
    ];

    return candidates.filter((c) => {
      if (params.countries.length > 0 && !params.countries.includes(c.country)) return false;
      if (params.industries.length > 0 && !params.industries.includes(c.industry)) return false;
      return true;
    });
  }
}

export class ApolloApiProvider implements DiscoveryProvider {
  name = 'apollo';

  isAvailable(): boolean {
    return Boolean(process.env.APOLLO_API_KEY && process.env.APOLLO_API_KEY !== 'your-apollo-api-key');
  }

  async search(params: DiscoverySearchParams): Promise<RawDiscoveryRecord[]> {
    if (!this.isAvailable()) {
      throw new Error(
        'Apollo API Key is not configured. Add APOLLO_API_KEY in .env.local to enable live Apollo discovery.'
      );
    }
    // Real Apollo Organization & Contact Search endpoint integration
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': process.env.APOLLO_API_KEY!,
      },
      body: JSON.stringify({
        q_organization_domains: params.keywords.join(' '),
        person_titles: ['Founder', 'CEO', 'Head of Marketing', 'Creative Director', 'VP Marketing'],
        page: 1,
        per_page: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apollo API returned error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const people = data.people || [];

    return people.map((p: any) => ({
      companyName: p.organization?.name || 'Unknown Company',
      website: p.organization?.primary_domain ? `https://${p.organization.primary_domain}` : '',
      industry: p.organization?.industry || 'General Business',
      country: p.country || 'Global',
      city: p.city,
      companySize: p.organization?.estimated_num_employees ? `${p.organization.estimated_num_employees}` : 'Unknown',
      description: p.organization?.short_description,
      decisionMakerName: `${p.first_name || ''} ${p.last_name || ''}`.trim() || undefined,
      decisionMakerTitle: p.title || 'Decision-Maker',
      decisionMakerEmail: p.email,
      decisionMakerLinkedIn: p.linkedin_url,
      signalSnippet: 'Identified via Apollo Verified decision-maker database matching target video buyer profile.',
      signalCategory: 'general_fit',
      signalUrl: p.organization?.primary_domain ? `https://${p.organization.primary_domain}` : undefined,
      sourceName: 'Apollo.io Verified B2B Database',
    }));
  }
}
