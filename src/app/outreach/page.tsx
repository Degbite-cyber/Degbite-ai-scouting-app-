'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import { useSearchParams } from 'next/navigation';
import {
  Send,
  Mail,
  Linkedin,
  MessageSquare,
  CheckCircle,
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { getLeads } from '@/lib/lead-store';
import { Lead, OutreachDraft } from '@/types';

function OutreachContent() {
  const searchParams = useSearchParams();
  const initialLeadId = searchParams.get('leadId');

  const [isDemo, setIsDemo] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId || '');
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'follow_up'>('email');
  const [tone, setTone] = useState<'consultative' | 'professional' | 'direct' | 'friendly'>('consultative');
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const loaded = getLeads(isDemo);
    setLeads(loaded);
    if (!selectedLeadId && loaded.length > 0) {
      setSelectedLeadId(loaded[0].id);
    }
  }, [isDemo]);

  const activeLead = leads.find((l) => l.id === selectedLeadId);

  const handleGenerateDraft = async () => {
    if (!selectedLeadId) return;
    setIsLoading(true);
    setIsApproved(false);
    try {
      const res = await fetch('/api/outreach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: selectedLeadId, channel, tone }),
      });
      const data = await res.json();
      if (data.success) {
        setDraft(data.draft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    const textToCopy = draft.subject ? `Subject: ${draft.subject}\n\n${draft.body}` : draft.body;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Personalized Outreach Studio</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Evidence-Grounded Copy
            </span>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 bg-surface-850 px-3 py-1.5 rounded-lg border border-wine-800/40">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Human Approval Required by Default</span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
                <h3 className="text-sm font-display font-bold text-white">Target Opportunity</h3>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">Select Lead</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.organization.name} ({l.organization.country})
                      </option>
                    ))}
                  </select>
                </div>

                {activeLead && (
                  <div className="p-3.5 rounded-lg bg-surface-950/60 border border-wine-900/40 space-y-2 text-xs">
                    <div>
                      <span className="text-gray-400">Contact:</span>{' '}
                      <span className="text-white font-semibold">
                        {activeLead.contact?.firstName} {activeLead.contact?.lastName} (
                        {activeLead.contact?.jobTitle || 'Executive'})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Industry:</span>{' '}
                      <span className="text-gold-400 font-medium">{activeLead.organization.industry}</span>
                    </div>
                    <div className="text-[11px] text-gray-300">
                      <span className="text-gold-400 font-semibold block mb-0.5">Verified Evidence:</span>
                      {activeLead.signal?.evidenceSummary}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setChannel('email')}
                      className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        channel === 'email'
                          ? 'bg-wine-800 text-gold-400 border-gold-500/40'
                          : 'bg-surface-850 text-gray-400 border-wine-900/40'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </button>
                    <button
                      onClick={() => setChannel('linkedin')}
                      className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        channel === 'linkedin'
                          ? 'bg-wine-800 text-gold-400 border-gold-500/40'
                          : 'bg-surface-850 text-gray-400 border-wine-900/40'
                      }`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => setChannel('follow_up')}
                      className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        channel === 'follow_up'
                          ? 'bg-wine-800 text-gold-400 border-gold-500/40'
                          : 'bg-surface-850 text-gray-400 border-wine-900/40'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Follow-up
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold">Tone</label>
                  <select
                    value={tone}
                    onChange={(e: any) => setTone(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="consultative">Consultative (High-Converting)</option>
                    <option value="professional">Professional & Direct</option>
                    <option value="friendly">Warm & Engaging</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateDraft}
                  disabled={isLoading || !selectedLeadId}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-wine-600 to-gold-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-wine-900/50 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  <span>{isLoading ? 'Crafting Draft...' : 'Generate Pitch Draft'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="p-6 rounded-xl card-luxury border border-wine-800/40 h-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-wine-800/30 pb-3">
                    <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-gold-400" />
                      Grounded Pitch Draft
                    </h3>

                    {draft && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="px-2.5 py-1 rounded bg-surface-850 hover:bg-wine-800/40 text-gold-400 text-xs font-medium border border-wine-700/40 flex items-center gap-1"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {!draft ? (
                    <div className="p-16 text-center text-gray-500 text-xs space-y-2">
                      <Mail className="w-8 h-8 mx-auto text-wine-600/60" />
                      <p>Select a lead and click "Generate Pitch Draft" to produce tailored outreach.</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {draft.subject && (
                        <div className="p-3 rounded-lg bg-surface-900 border border-wine-800/30">
                          <span className="text-[10px] uppercase font-bold text-gold-400 block mb-0.5">
                            Subject Line
                          </span>
                          <span className="text-xs text-white font-medium">{draft.subject}</span>
                        </div>
                      )}

                      <div className="p-4 rounded-lg bg-surface-900 border border-wine-800/30 whitespace-pre-line text-xs text-gray-200 leading-relaxed font-sans">
                        {draft.body}
                      </div>

                      <div className="p-3 rounded-lg bg-surface-950/70 border border-wine-900/30 text-[11px] text-gray-400 space-y-1">
                        <div>
                          <strong className="text-gold-400">Value Proposition:</strong> {draft.valueProposition}
                        </div>
                        <div>
                          <strong className="text-gold-400">Recommended Service:</strong> {draft.suggestedOffer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {draft && (
                  <div className="border-t border-wine-800/30 pt-4 flex items-center justify-between">
                    <div className="text-[11px] text-gray-400">
                      Status:{' '}
                      <span className={isApproved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {isApproved ? 'Approved for Dispatch' : 'Awaiting Approval'}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsApproved(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isApproved
                          ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                          : 'bg-wine-600 hover:bg-wine-500 text-white'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isApproved ? 'Approved' : 'Approve Pitch'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OutreachPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-950 text-gray-400 flex items-center justify-center text-xs">Loading Outreach Studio...</div>}>
      <OutreachContent />
    </Suspense>
  );
}
