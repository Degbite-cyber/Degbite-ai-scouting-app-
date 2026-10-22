'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  ArrowRight,
  Database,
  Building,
  Upload,
} from 'lucide-react';
import { Lead } from '@/types';
import Link from 'next/link';

export default function DiscoveryPage() {
  const [isDemo, setIsDemo] = useState(true);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([
    'E-commerce & DTC',
    'Marketing agencies',
    'SaaS & Tech',
  ]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    'United States',
    'United Kingdom',
    'United Arab Emirates',
    'Australia',
  ]);
  const [provider, setProvider] = useState<'mock_sandbox' | 'apollo' | 'tavily'>('tavily');
  const [apolloKey, setApolloKey] = useState<string>('');
  const [tavilyKey, setTavilyKey] = useState<string>('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');
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredLeads, setDiscoveredLeads] = useState<Lead[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApollo = localStorage.getItem('scout_apollo_key');
      if (savedApollo) setApolloKey(savedApollo);
      const savedTavily = localStorage.getItem('scout_tavily_key');
      if (savedTavily) setTavilyKey(savedTavily);
    }
  }, []);

  const industriesList = [
    'Marketing agencies',
    'E-commerce & DTC',
    'SaaS & Tech',
    'Real Estate Marketing',
    'Content Businesses',
  ];

  const countriesList = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'United Arab Emirates',
    'Germany',
  ];

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const toggleCountry = (ctry: string) => {
    setSelectedCountries((prev) =>
      prev.includes(ctry) ? prev.filter((c) => c !== ctry) : [...prev, ctry]
    );
  };

  const handleRunDiscovery = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (typeof window !== 'undefined') {
        if (apolloKey.trim()) localStorage.setItem('scout_apollo_key', apolloKey.trim());
        if (tavilyKey.trim()) localStorage.setItem('scout_tavily_key', tavilyKey.trim());
      }

      const activeKey =
        provider === 'apollo'
          ? apolloKey.trim()
          : provider === 'tavily'
          ? (tavilyKey.trim() || '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')
          : undefined;

      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industries: selectedIndustries,
          countries: selectedCountries,
          companySizes: ['1-10', '11-50', '51-200'],
          keywords: ['ai video', 'n8n', 'creative automation'],
          provider,
          isDemo,
          apiKey: activeKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete discovery job.');
      }

      setDiscoveredLeads(data.leads || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Buyer Discovery Engine</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Worldwide Scouting
            </span>
          </div>

          <div className="text-xs text-gray-400">
            Target Quota: <span className="text-gold-400 font-semibold">20–40 prospects/day</span>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Search Configuration Card */}
          <div className="rounded-xl card-luxury p-6 border border-wine-800/40 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-wine-800/30 pb-4">
              <div>
                <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-gold-400" />
                  Target Discovery Parameters
                </h3>
                <p className="text-xs text-gray-400">
                  Select target industries, geographic priority markets, and data providers.
                </p>
              </div>

              {/* Provider Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs text-gray-300 font-medium">Provider:</span>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="bg-surface-850 border border-wine-700/50 rounded-lg px-3 py-1.5 text-xs text-gold-300 font-semibold focus:outline-none focus:border-gold-500"
                >
                  <option value="tavily">Tavily Live Web Search (Active Live AI)</option>
                  <option value="mock_sandbox">Sandbox Verified Feed (Free / Test)</option>
                  <option value="apollo">Apollo.io B2B Search (Live API)</option>
                </select>
              </div>
            </div>

            {/* Tavily API Key inline input when Tavily is selected */}
            {provider === 'tavily' && (
              <div className="p-3.5 rounded-lg bg-surface-900 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Tavily Live AI Search Key
                  </label>
                  <span className="text-[10px] text-emerald-400 font-medium">Pre-configured & Active</span>
                </div>
                <input
                  type="password"
                  placeholder="tvly-dev-..."
                  value={tavilyKey}
                  onChange={(e) => setTavilyKey(e.target.value)}
                  className="w-full bg-surface-850 border border-wine-700/60 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            )}

            {/* Apollo API Key inline input when Apollo is selected */}
            {provider === 'apollo' && (
              <div className="p-3.5 rounded-lg bg-surface-900 border border-gold-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-gold-400" />
                    Apollo.io API Key
                  </label>
                  <span className="text-[10px] text-gray-400">Saved to browser automatically</span>
                </div>
                <input
                  type="password"
                  placeholder="Paste your Apollo API key here..."
                  value={apolloKey}
                  onChange={(e) => setApolloKey(e.target.value)}
                  className="w-full bg-surface-850 border border-wine-700/60 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            )}

            {/* Target Industries Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
                Target Niches & Industries
              </label>
              <div className="flex flex-wrap gap-2">
                {industriesList.map((ind) => {
                  const active = selectedIndustries.includes(ind);
                  return (
                    <button
                      key={ind}
                      onClick={() => toggleIndustry(ind)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        active
                          ? 'bg-wine-800/80 border-gold-500/40 text-gold-400 shadow-sm'
                          : 'bg-surface-850/50 border-wine-800/30 text-gray-400 hover:text-white'
                      }`}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Countries Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
                Worldwide Priority Markets
              </label>
              <div className="flex flex-wrap gap-2">
                {countriesList.map((ctry) => {
                  const active = selectedCountries.includes(ctry);
                  return (
                    <button
                      key={ctry}
                      onClick={() => toggleCountry(ctry)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        active
                          ? 'bg-wine-800/80 border-gold-500/40 text-gold-400 shadow-sm'
                          : 'bg-surface-850/50 border-wine-800/30 text-gray-400 hover:text-white'
                      }`}
                    >
                      {ctry}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message if Any */}
            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Trigger Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-gray-400">
                Mode: <span className="text-white font-semibold">{isDemo ? 'Demo Mode' : 'Live Mode'}</span> |
                Signals: <span className="text-gold-400 font-semibold">100-Point Evidence Grounded</span>
              </div>

              <button
                onClick={handleRunDiscovery}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-wine-600 to-gold-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-wine-900/50 transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>{isLoading ? 'Scouting Opportunities...' : 'Run Discovery Job'}</span>
              </button>
            </div>
          </div>

          {/* Results Area */}
          {discoveredLeads.length > 0 && (
            <div className="rounded-xl card-luxury overflow-hidden border border-wine-800/40 space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-wine-800/30 pb-3">
                <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Discovered & Qualified Leads ({discoveredLeads.length})
                </h4>
                <Link
                  href="/leads"
                  className="text-xs text-gold-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Manage in CRM
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoveredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl bg-surface-900/80 border border-wine-800/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">{lead.organization.name}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          (lead.score?.totalScore ?? 0) >= 80
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                            : 'bg-wine-700/30 text-wine-200 border border-wine-600/30'
                        }`}
                      >
                        {lead.score?.totalScore}/100
                      </span>
                    </div>

                    <div className="text-xs text-gray-400">
                      <span className="text-gray-300 font-medium">{lead.organization.industry}</span> •{' '}
                      {lead.organization.country}
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-950/70 border border-wine-900/30 text-[11px] text-gray-300">
                      <div className="text-[10px] uppercase font-bold text-gold-400/90 mb-1">
                        Buying Evidence
                      </div>
                      {lead.signal?.evidenceSummary}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-gray-400 text-[11px]">
                        Contact:{' '}
                        <span className="text-white font-medium">
                          {lead.contact?.firstName} {lead.contact?.lastName} ({lead.contact?.jobTitle})
                        </span>
                      </span>

                      <Link
                        href={`/outreach?leadId=${lead.id}`}
                        className="px-3 py-1 rounded bg-wine-700 hover:bg-wine-600 text-white font-semibold text-[11px] transition"
                      >
                        Draft Pitch
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
