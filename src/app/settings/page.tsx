'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Settings as SettingsIcon,
  Globe,
  Sliders,
  DollarSign,
  Bell,
  Clock,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const [isDemo, setIsDemo] = useState(true);
  const [minScore, setMinScore] = useState(60);
  const [dailyQuota, setDailyQuota] = useState(30);
  const [notificationEmail, setNotificationEmail] = useState('adegbitedavid90@gmail.com');
  const [timezone, setTimezone] = useState('UTC');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">System Settings & Prospecting Preferences</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Personal Command Center
            </span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-4xl mx-auto w-full">
          {isSaved && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Settings updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <div className="flex items-center gap-2 border-b border-wine-800/30 pb-3">
                <Sliders className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-display font-bold text-white">Scouting & Qualification Thresholds</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    Minimum Qualification Score (0–100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Opportunities below this score are labeled "Low Priority" and excluded from daily alerts.
                  </p>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    Daily Discovery Target
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={dailyQuota}
                    onChange={(e) => setDailyQuota(Number(e.target.value))}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Recommended: 20–40 prospects/day to ensure high quality and zero fabricated records.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl card-luxury border border-wine-800/40 space-y-4">
              <div className="flex items-center gap-2 border-b border-wine-800/30 pb-3">
                <Bell className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-display font-bold text-white">Daily Digest & Notifications</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    Executive Notification Email
                  </label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    High-priority buyer summaries and due follow-up tasks are delivered to this address.
                  </p>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-surface-850 border border-wine-700/50 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-wine-600 to-gold-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-wine-900/50 transition"
              >
                <Save className="w-4 h-4 text-gold-300" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
