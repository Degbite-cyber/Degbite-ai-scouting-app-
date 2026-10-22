'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  PieChart,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [isDemo, setIsDemo] = useState(true);

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Prospecting Analytics & ROI Intelligence</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Performance Insights
            </span>
          </div>

          <div className="text-xs text-gray-400">
            Current Cycle: <span className="text-gold-400 font-bold">This Month</span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl card-luxury space-y-2 border border-wine-800/40">
              <span className="text-xs text-gray-400 font-medium">Estimated Time Saved</span>
              <div className="text-2xl font-bold font-display text-white">48.5 hrs</div>
              <p className="text-[11px] text-gray-400">Automated signal monitoring vs manual prospecting</p>
            </div>

            <div className="p-5 rounded-xl card-luxury space-y-2 border border-wine-800/40">
              <span className="text-xs text-gray-400 font-medium">Qualification Accuracy</span>
              <div className="text-2xl font-bold font-display text-gold-400">92.4%</div>
              <p className="text-[11px] text-gray-400">Grounding rate verified with primary evidence links</p>
            </div>

            <div className="p-5 rounded-xl card-luxury space-y-2 border border-wine-800/40">
              <span className="text-xs text-gray-400 font-medium">Projected Pipeline Value</span>
              <div className="text-2xl font-bold font-display text-emerald-400">$34,800</div>
              <p className="text-[11px] text-gray-400">Based on recurring video automation retainers</p>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-gold-400" />
                Opportunities by Industry
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>E-commerce & DTC</span>
                    <span className="text-gold-400 font-bold">42%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500 rounded-full w-[42%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>Marketing Agencies</span>
                    <span className="text-gold-400 font-bold">28%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-900 rounded-full overflow-hidden">
                    <div className="h-full bg-wine-500 rounded-full w-[28%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>SaaS & Technology</span>
                    <span className="text-gold-400 font-bold">18%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>Real Estate Marketing</span>
                    <span className="text-gold-400 font-bold">12%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-900 rounded-full overflow-hidden">
                    <div className="h-full bg-wine-700 rounded-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Conversion Funnel Performance
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-950/70 border border-wine-900/30 flex items-center justify-between">
                  <span className="text-gray-300">Signals Detected → Qualified Leads</span>
                  <span className="font-bold text-white">68% Qualification Rate</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-950/70 border border-wine-900/30 flex items-center justify-between">
                  <span className="text-gray-300">Outreach Sent → Response Rate</span>
                  <span className="font-bold text-gold-400">24.5% Positive Replies</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-950/70 border border-wine-900/30 flex items-center justify-between">
                  <span className="text-gray-300">Replied → Strategy Call Booked</span>
                  <span className="font-bold text-emerald-400">41.2% Meeting Conversion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
