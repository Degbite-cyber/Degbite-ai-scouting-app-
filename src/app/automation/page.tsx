'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Cpu,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  schedule: string;
  status: 'Active' | 'Ready' | 'Configured';
  lastRun: string;
  file: string;
}

const WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-a',
    name: 'Workflow A: Daily Buyer Discovery',
    description:
      'Queries enabled providers every morning at 8:00 AM, normalizes records, filters duplicates, qualifies leads with the 100-point rubric, and saves them to the CRM.',
    schedule: 'Every day at 8:00 AM',
    status: 'Active',
    lastRun: 'Today at 08:00 AM (34 prospects scouted)',
    file: 'n8n/workflow_a_daily_buyer_discovery.json',
  },
  {
    id: 'wf-b',
    name: 'Workflow B: Signal Reverification',
    description:
      'Rechecks existing buying signal URLs for freshness, archiving expired RFPs or filled job openings to maintain data integrity.',
    schedule: 'Every 48 hours',
    status: 'Ready',
    lastRun: 'Yesterday at 14:30 PM (All fresh)',
    file: 'n8n/workflow_a_daily_buyer_discovery.json',
  },
  {
    id: 'wf-c',
    name: 'Workflow C: Daily Buyer Executive Digest',
    description:
      'Compiles the highest-priority qualified buyers (Score >= 80) and sends an executive email summary to your inbox with recommended service offers.',
    schedule: 'Every day at 6:00 PM',
    status: 'Active',
    lastRun: 'Scheduled for 18:00 PM today',
    file: 'n8n/workflow_c_daily_buyer_digest.json',
  },
  {
    id: 'wf-d',
    name: 'Workflow D: Follow-Up & Outreach Reminders',
    description:
      'Scans leads in "Contacted" stage that have not received a reply after 3 days and generates follow-up draft notifications.',
    schedule: 'Daily at 10:00 AM',
    status: 'Configured',
    lastRun: 'Today at 10:00 AM',
    file: 'n8n/workflow_c_daily_buyer_digest.json',
  },
];

export default function AutomationPage() {
  const [isDemo, setIsDemo] = useState(true);

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Automation Center (n8n Engine)</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Autonomous Workflows
            </span>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>n8n Webhook Ingestion Connected</span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="p-5 rounded-xl bg-surface-900/80 border border-wine-800/40 space-y-2">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-gold-400" />
              Pre-Packaged n8n Workflow Automations
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
              These workflows run independently in your n8n workspace or cron trigger. All generated JSON files are
              located in the <code className="text-gold-400 font-mono">n8n/</code> directory of your project, ready for
              one-click import.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKFLOWS.map((wf) => (
              <div
                key={wf.id}
                className="p-5 rounded-xl card-luxury border border-wine-800/40 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{wf.name}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      {wf.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{wf.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-wine-900/40 text-xs">
                  <div className="flex items-center justify-between text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {wf.schedule}
                    </span>
                    <span className="text-gray-500">{wf.lastRun}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <code className="text-[10px] text-gray-400 font-mono bg-surface-950 px-2 py-1 rounded border border-wine-900/40">
                      {wf.file}
                    </code>

                    <span className="text-[11px] text-gold-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Import Ready
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
