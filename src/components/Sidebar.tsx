'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Zap,
  Target,
  UserCheck,
  Send,
  KanbanSquare,
  Cpu,
  BarChart3,
  Plug,
  Settings,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
}

export const navigationItems = [
  { name: 'Overview Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Buyer Discovery', href: '/discovery', icon: Compass },
  { name: 'Buying Signals', href: '/signals', icon: Zap },
  { name: 'Qualified Leads', href: '/leads', icon: Target },
  { name: 'Decision-Makers', href: '/contacts', icon: UserCheck },
  { name: 'Outreach Studio', href: '/outreach', icon: Send },
  { name: 'Sales Pipeline', href: '/pipeline', icon: KanbanSquare },
  { name: 'Automation Center', href: '/automation', icon: Cpu },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Integrations', href: '/integrations', icon: Plug },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isDemo, setIsDemo }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-wine-800/40 bg-surface-900/90 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-wine-800/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine-600 to-gold-500 p-[1.5px] shadow-sm flex items-center justify-center">
          <div className="w-full h-full bg-surface-900 rounded-[10px] flex items-center justify-center font-display font-bold text-gold-400">
            DA
          </div>
        </div>
        <div>
          <h1 className="font-display font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
            BUYER SCOUT
            <span className="text-[10px] text-gold-400 bg-wine-900/80 px-1.5 py-0.5 rounded border border-gold-500/20">
              PRO
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 font-medium">David Adegbite Intelligence</p>
        </div>
      </div>

      {/* Mode Switcher Banner (Demo vs Live) */}
      <div className="px-4 py-3 border-b border-wine-800/30 bg-surface-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isDemo ? (
              <span className="flex items-center gap-1 text-gold-400">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                DEMO MODE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                LIVE MODE
              </span>
            )}
          </div>
          <button
            onClick={() => setIsDemo(!isDemo)}
            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition ${
              isDemo
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            Switch to {isDemo ? 'Live' : 'Demo'}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-wine-700/80 to-surface-850 text-gold-400 border-l-2 border-gold-500 font-semibold shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-surface-850/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-wine-800/40 bg-surface-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-wine-700 flex items-center justify-center font-bold text-xs text-white">
            DA
          </div>
          <div>
            <div className="text-xs font-semibold text-white">David Adegbite</div>
            <div className="text-[10px] text-gray-400">Owner & AI Operator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
