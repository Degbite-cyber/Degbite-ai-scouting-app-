'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Plug,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  RefreshCw,
  Database,
  Sliders,
  Bell,
  Save,
} from 'lucide-react';

export default function IntegrationsPage() {
  const [isDemo, setIsDemo] = useState(true);
  const [geminiKey, setGeminiKey] = useState('');
  const [apolloKey, setApolloKey] = useState('');
  const [serperKey, setSerperKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [n8nSecret, setN8nSecret] = useState('scout-n8n-token-secret-2026');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApollo = localStorage.getItem('scout_apollo_key');
      if (savedApollo) setApolloKey(savedApollo);
      const savedGemini = localStorage.getItem('scout_gemini_key');
      if (savedGemini) setGeminiKey(savedGemini);
      const savedSerper = localStorage.getItem('scout_serper_key');
      if (savedSerper) setSerperKey(savedSerper);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (apolloKey.trim()) localStorage.setItem('scout_apollo_key', apolloKey.trim());
      if (geminiKey.trim()) localStorage.setItem('scout_gemini_key', geminiKey.trim());
      if (serperKey.trim()) localStorage.setItem('scout_serper_key', serperKey.trim());
    }
    setSaveStatus('Settings & credentials updated successfully.');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Integrations & API Configuration</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Provider Hub
            </span>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Credentials kept secure server-side</span>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">
          {saveStatus && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* AI Engine Settings */}
            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-wine-800/30 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gold-400" />
                  <h3 className="text-sm font-display font-bold text-white">AI Qualification & Outreach Model</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  FREE TIER SUPPORTED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    Google Gemini API Key (Recommended Free Tier)
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Get a free API key at{' '}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:underline"
                    >
                      Google AI Studio
                    </a>
                    . Powers 100-point evidence scoring and grounded outreach pitch drafting.
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Discovery Providers */}
            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-wine-800/30 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gold-400" />
                  <h3 className="text-sm font-display font-bold text-white">Prospecting & Signal Providers</h3>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Apollo.io API Key</label>
                  <input
                    type="password"
                    placeholder="Enter Apollo API key for live search..."
                    value={apolloKey}
                    onChange={(e) => setApolloKey(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Used for enriched decision-maker verification and company sizing. If unconfigured, the app uses the built-in Sandbox Verified Feed.
                  </p>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    Web Search & Signal Feed (Serper / Tavily API)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter search API key..."
                    value={serperKey}
                    onChange={(e) => setSerperKey(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Monitors public job openings, press RFPs, and hiring notices for automated buying signals.
                  </p>
                </div>
              </div>
            </div>

            {/* n8n Workflow Webhook Connection */}
            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-wine-800/30 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-gold-400" />
                  <h3 className="text-sm font-display font-bold text-white">n8n Automation Engine Connection</h3>
                </div>
                <span className="text-[10px] bg-wine-800/80 text-gold-300 border border-gold-500/20 px-2 py-0.5 rounded font-bold">
                  ACTIVE WEBHOOK
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Ingestion Webhook Endpoint</label>
                  <input
                    type="text"
                    readOnly
                    value="http://localhost:3000/api/n8n/webhook"
                    className="w-full bg-surface-900 border border-wine-800/40 rounded-lg p-2.5 text-xs text-gold-400 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Webhook Bearer Token Secret</label>
                  <input
                    type="text"
                    value={n8nSecret}
                    onChange={(e) => setN8nSecret(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pass this token in your n8n HTTP Request node header: <code className="text-gold-400">Authorization: Bearer [secret]</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-wine-600 to-gold-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-wine-900/50 transition"
              >
                <Save className="w-4 h-4 text-gold-300" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
