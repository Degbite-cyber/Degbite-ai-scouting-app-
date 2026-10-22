'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Building,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface SignalItem {
  id: string;
  companyName: string;
  source: string;
  sourceUrl: string;
  category: 'Explicit Request' | 'Strong Need' | 'Indirect Opportunity';
  evidence: string;
  date: string;
  freshness: 'Fresh' | 'Aging';
  confidence: number;
}

const SIGNALS: SignalItem[] = [
  {
    id: 'sig-1',
    companyName: 'LuxeGlow Cosmetics',
    source: 'Greenhouse Career Board',
    sourceUrl: 'https://boards.greenhouse.io/luxeglow/jobs/928192',
    category: 'Explicit Request',
    evidence:
      'Hiring for "Creative Automation / AI Video Production Lead" to scale TikTok creative variation output from 5 to 30 ads weekly.',
    date: '2 hours ago',
    freshness: 'Fresh',
    confidence: 0.95,
  },
  {
    id: 'sig-2',
    companyName: 'StackFlow Automation',
    source: 'Press & RFP Release',
    sourceUrl: 'https://stackflowhq.com/press/v3-launch-rfp',
    category: 'Strong Need',
    evidence:
      'Issued public RFP seeking video agency or automation partner for Q4 product release walk-throughs and customer training series.',
    date: '1 day ago',
    freshness: 'Fresh',
    confidence: 0.91,
  },
  {
    id: 'sig-3',
    companyName: 'Apex Media Growth',
    source: 'Founder Post / Twitter',
    sourceUrl: 'https://twitter.com/liam_apex/status/189201948',
    category: 'Explicit Request',
    evidence:
      'Founder publicly asking for recommendations for an n8n or Make.com video workflow specialist to automate client ad variations.',
    date: '2 days ago',
    freshness: 'Fresh',
    confidence: 0.94,
  },
  {
    id: 'sig-4',
    companyName: 'Skyline Capital Properties',
    source: 'Official Brokerage Media Feed',
    sourceUrl: 'https://skylinecapitaluae.com/news/listing-media-expansion',
    category: 'Indirect Opportunity',
    evidence:
      'Announced plan to convert 50+ luxury villa listings into automated vertical social video tours for YouTube Shorts & Instagram.',
    date: '4 days ago',
    freshness: 'Aging',
    confidence: 0.82,
  },
];

export default function SignalsPage() {
  const [isDemo, setIsDemo] = useState(true);

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Buying Signals Feed</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Live Intent Monitor
            </span>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gold-400" />
            <span>Reverified automatically daily</span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="p-5 rounded-xl bg-surface-900/80 border border-wine-800/40 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold-400" />
                Verified Commercial Signals
              </h3>
              <p className="text-xs text-gray-400">
                Every detected signal includes verified data provenance, source URLs, and original published dates.
              </p>
            </div>

            <Link
              href="/discovery"
              className="px-3.5 py-1.5 rounded-lg bg-wine-700 hover:bg-wine-600 text-white font-semibold text-xs transition"
            >
              Scan New Signals
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SIGNALS.map((sig) => (
              <div
                key={sig.id}
                className="p-5 rounded-xl card-luxury border border-wine-800/40 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{sig.companyName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sig.category === 'Explicit Request'
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          : 'bg-wine-800/40 text-wine-200 border border-wine-700/40'
                      }`}
                    >
                      {sig.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span className="text-gray-300 font-medium">{sig.source}</span> •{' '}
                    <span>{sig.date}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-950/70 border border-wine-900/40 text-xs text-gray-200 leading-relaxed">
                    {sig.evidence}
                  </div>
                </div>

                <div className="pt-3 border-t border-wine-900/40 flex items-center justify-between text-xs">
                  <a
                    href={sig.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400/90 hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
                  >
                    <span>View Provenance Source</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <Link
                    href={`/outreach`}
                    className="px-2.5 py-1 rounded bg-surface-850 hover:bg-wine-800/40 text-gold-300 text-xs font-semibold border border-wine-700/40 inline-flex items-center gap-1"
                  >
                    Action Lead
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
