'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getLeads, updateLeadStage } from '@/lib/lead-store';
import { Lead, PipelineStage } from '@/types';
import {
  KanbanSquare,
  Building,
  User,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const STAGES: PipelineStage[] = [
  'Discovered',
  'Qualified',
  'Ready for Outreach',
  'Contacted',
  'Replied',
  'Meeting Booked',
  'Proposal Sent',
  'Won',
];

export default function PipelinePage() {
  const [isDemo, setIsDemo] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(getLeads(isDemo));
  }, [isDemo]);

  const handleMoveStage = (leadId: string, newStage: PipelineStage) => {
    const updated = updateLeadStage(leadId, newStage);
    if (updated) {
      setLeads([...getLeads(isDemo)]);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Sales Pipeline</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              11-Stage CRM
            </span>
          </div>

          <div className="text-xs text-gray-400">
            Active Deals: <span className="text-white font-bold">{leads.length}</span>
          </div>
        </header>

        <div className="p-8 flex-1 flex flex-col space-y-6">
          <div className="flex gap-4 overflow-x-auto pb-6 flex-1 min-h-[600px]">
            {STAGES.map((stage) => {
              const stageLeads = leads.filter((l) => l.pipelineStage === stage);
              return (
                <div
                  key={stage}
                  className="w-72 shrink-0 rounded-xl bg-surface-900/70 border border-wine-800/40 flex flex-col overflow-hidden"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-wine-800/40 bg-surface-850 flex items-center justify-between">
                    <span className="font-bold text-xs text-white uppercase tracking-wider">{stage}</span>
                    <span className="text-[10px] bg-wine-900/80 text-gold-400 px-2 py-0.5 rounded-full font-bold border border-gold-500/20">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards inside stage */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {stageLeads.length === 0 ? (
                      <div className="h-28 border border-dashed border-wine-900/40 rounded-lg flex items-center justify-center text-gray-600 text-xs">
                        Empty Stage
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-lg bg-surface-950/90 border border-wine-800/30 hover:border-gold-500/40 transition space-y-2.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{lead.organization.name}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                (lead.score?.totalScore ?? 0) >= 80
                                  ? 'bg-gold-500/20 text-gold-400'
                                  : 'bg-wine-800/40 text-wine-300'
                              }`}
                            >
                              {lead.score?.totalScore ?? 'N/A'}
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Building className="w-3 h-3 text-wine-500" />
                            <span>{lead.organization.industry}</span>
                          </div>

                          {lead.contact && (
                            <div className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-gold-500 shrink-0" />
                              <span className="truncate">
                                {lead.contact.firstName} {lead.contact.lastName}
                              </span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-wine-900/40 flex items-center justify-between">
                            <Link
                              href={`/outreach?leadId=${lead.id}`}
                              className="text-[10px] text-gold-400 hover:underline font-semibold"
                            >
                              Draft Pitch
                            </Link>

                            {/* Move stage button */}
                            <select
                              value={lead.pipelineStage}
                              onChange={(e: any) => handleMoveStage(lead.id, e.target.value)}
                              className="bg-surface-850 text-[10px] border border-wine-700/40 rounded px-1.5 py-0.5 text-gray-300 focus:outline-none"
                            >
                              {STAGES.map((s) => (
                                <option key={s} value={s}>
                                  → {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
