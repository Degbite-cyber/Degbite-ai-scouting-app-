'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Building,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { getDashboardMetrics, getLeads } from '@/lib/lead-store';
import Link from 'next/link';

export default function DashboardPage() {
  const [isDemo, setIsDemo] = useState(true);
  const metrics = getDashboardMetrics(isDemo);
  const leads = getLeads(isDemo);

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Overview Dashboard</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              {isDemo ? 'Sandbox Demo Environment' : 'Live Production Database'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/discovery"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine-600 to-wine-500 hover:brightness-110 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-wine-900/40 transition"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Launch Discovery Job</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-surface-900 via-surface-850 to-wine-950/40 border border-wine-800/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-wine-600/10 to-transparent pointer-events-none" />
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold tracking-wider text-gold-400 uppercase">
                Autonomous Client Acquisition
              </span>
              <h1 className="text-2xl font-display font-bold text-white">
                Welcome back, David. Ready to scout video automation buyers?
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Discovering evidence-backed buying signals worldwide across Agencies, E-commerce DTC, SaaS,
                and Real Estate for n8n video automation and AI video creation workflows.
              </p>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl card-luxury space-y-3">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Total Discovered</span>
                <Building className="w-4 h-4 text-wine-500" />
              </div>
              <div className="text-2xl font-bold font-display text-white">{metrics.totalDiscovered}</div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold">Active</span> verified companies in system
              </div>
            </div>

            <div className="p-5 rounded-xl card-luxury space-y-3">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">High-Priority Matches</span>
                <Target className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-2xl font-bold font-display text-gold-400">{metrics.highPriority}</div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                Score 80–100 / Confirmed buying budget
              </div>
            </div>

            <div className="p-5 rounded-xl card-luxury space-y-3">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Fresh Buying Signals</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">{metrics.activeSignals}</div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                RFP / Job hiring / Video initiatives
              </div>
            </div>

            <div className="p-5 rounded-xl card-luxury space-y-3">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Meetings Booked</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-display text-emerald-400">{metrics.meetingsBooked}</div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                Deals won: <span className="text-white font-semibold ml-1">{metrics.dealsWon}</span>
              </div>
            </div>
          </div>

          {/* Qualified Opportunities Table */}
          <div className="rounded-xl card-luxury overflow-hidden border border-wine-800/40">
            <div className="p-5 border-b border-wine-800/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-white">Top Qualified Opportunities</h3>
                <p className="text-xs text-gray-400">
                  Ranked by 100-point transparent evidence rubric
                </p>
              </div>

              <Link
                href="/leads"
                className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
              >
                View all leads
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-850 flex items-center justify-center mx-auto text-gray-500">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">No live leads found</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Run a live buyer discovery job or import a CSV lead list to populate real opportunities.
                </p>
                <Link
                  href="/discovery"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-wine-600 hover:bg-wine-500 text-xs font-semibold text-white"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  Start Discovery
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-900/90 text-gray-400 uppercase tracking-wider text-[10px] border-b border-wine-800/30">
                    <tr>
                      <th className="py-3 px-5">Company & Domain</th>
                      <th className="py-3 px-5">Industry / Geo</th>
                      <th className="py-3 px-5">Score & Category</th>
                      <th className="py-3 px-5">Decision-Maker</th>
                      <th className="py-3 px-5">Recommended Service Offer</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wine-800/20 text-gray-300">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-wine-900/20 transition">
                        <td className="py-4 px-5">
                          <div className="font-semibold text-white">{lead.organization.name}</div>
                          <a
                            href={lead.organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-gold-400/90 hover:underline flex items-center gap-1"
                          >
                            {lead.organization.normalizedDomain}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-medium text-gray-200">{lead.organization.industry}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-wine-500" />
                            {lead.organization.country}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (lead.score?.totalScore ?? 0) >= 80
                                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                  : 'bg-wine-700/30 text-wine-200 border border-wine-600/30'
                              }`}
                            >
                              {lead.score?.totalScore ?? 'N/A'}/100
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {lead.score?.classification}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          {lead.contact ? (
                            <div>
                              <div className="font-semibold text-white">
                                {lead.contact.firstName} {lead.contact.lastName}
                              </div>
                              <div className="text-[11px] text-gray-400">{lead.contact.jobTitle}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Research pending</span>
                          )}
                        </td>

                        <td className="py-4 px-5 max-w-xs">
                          <div className="text-gray-200 truncate font-medium">
                            {lead.recommendedService}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate">
                            {lead.recommendedNextAction}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="px-3 py-1.5 rounded-md bg-surface-850 hover:bg-wine-800/50 text-gold-400 font-semibold text-xs border border-wine-700/40 inline-flex items-center gap-1 transition"
                          >
                            View Lead
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
