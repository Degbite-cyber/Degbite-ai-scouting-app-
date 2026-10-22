'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getLeads, deleteLead } from '@/lib/lead-store';
import { Lead } from '@/types';
import {
  Target,
  ExternalLink,
  MapPin,
  Trash2,
  Send,
  Filter,
  CheckCircle2,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const [isDemo, setIsDemo] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterScore, setFilterScore] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    setLeads(getLeads(isDemo));
  }, [isDemo]);

  const handleDelete = (id: string) => {
    deleteLead(id);
    setLeads([...getLeads(isDemo)]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('isDemo', String(isDemo));

    try {
      const res = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to import CSV.');
      }
      setUploadMessage(`Imported ${data.importedCount} leads successfully.`);
      setLeads([...getLeads(isDemo)]);
    } catch (err: any) {
      setUploadMessage(`Error: ${err.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Company,Website,Industry,Country,Contact,Title,Email,Signal\n' +
      'GlowPure Skincare,https://glowpure.com,E-commerce & DTC,United States,Emma Watson,Marketing Director,emma@glowpure.com,Hiring UGC creators to scale TikTok ads\n' +
      'Nexus SaaS,https://nexushq.io,SaaS & Tech,United Kingdom,Liam Gallagher,Head of Product,liam@nexushq.io,Seeking agency for platform video walk-throughs\n' +
      'Vanguard Creative,https://vanguardcreative.agency,Marketing agencies,Australia,Chloe Bennett,Agency Owner,chloe@vanguardcreative.agency,Looking for n8n automation partner\n' +
      'Palm Luxury Realty,https://palmluxury.ae,Real Estate Marketing,United Arab Emirates,Omar Fayed,Managing Broker,omar@palmluxury.ae,Announced automated video tour initiative';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scout_lead_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Company', 'Domain', 'Industry', 'Country', 'Score', 'DecisionMaker', 'Email', 'ServiceOffer'],
      ...leads.map((l) => [
        `"${l.organization.name}"`,
        l.organization.normalizedDomain,
        `"${l.organization.industry}"`,
        `"${l.organization.country}"`,
        l.score?.totalScore ?? 'N/A',
        `"${l.contact?.firstName || ''} ${l.contact?.lastName || ''}"`,
        l.contact?.email || '',
        `"${l.recommendedService}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_video_buyers_${isDemo ? 'demo' : 'live'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    if (filterScore === 'high') return (l.score?.totalScore ?? 0) >= 80;
    if (filterScore === 'medium') return (l.score?.totalScore ?? 0) >= 60 && (l.score?.totalScore ?? 0) < 80;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Qualified Leads Database</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              {filteredLeads.length} Total Matches
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="bg-surface-850 border border-wine-700/50 rounded-lg px-3 py-1.5 text-xs text-gold-300 font-semibold focus:outline-none"
            >
              <option value="all">All Scores</option>
              <option value="high">High Priority (80+)</option>
              <option value="medium">Worth Investigating (60–79)</option>
            </select>

            {/* Download Template Button */}
            <button
              onClick={handleDownloadTemplate}
              title="Download pre-formatted CSV template"
              className="px-2.5 py-1.5 rounded-lg bg-surface-850 hover:bg-wine-800/50 text-gray-300 hover:text-white text-xs font-medium border border-wine-800/40 inline-flex items-center gap-1 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-gold-400" />
              <span>Sample Template</span>
            </button>

            {/* CSV Import */}
            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-surface-850 hover:bg-wine-800/50 text-gold-400 text-xs font-semibold border border-wine-700/40 inline-flex items-center gap-1.5 transition">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Importing...' : 'Import CSV'}</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-surface-850 hover:bg-wine-800/50 text-gold-400 text-xs font-semibold border border-wine-700/40 inline-flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {uploadMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                uploadMessage.startsWith('Error')
                  ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {uploadMessage.startsWith('Error') ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{uploadMessage}</span>
            </div>
          )}

          <div className="rounded-xl card-luxury overflow-hidden border border-wine-800/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-900/90 text-gray-400 uppercase tracking-wider text-[10px] border-b border-wine-800/30">
                  <tr>
                    <th className="py-3 px-5">Organization</th>
                    <th className="py-3 px-5">Score & Rubric</th>
                    <th className="py-3 px-5">Key Decision-Maker</th>
                    <th className="py-3 px-5">Pipeline Stage</th>
                    <th className="py-3 px-5">Recommended Service</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wine-800/20 text-gray-300">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-wine-900/20 transition">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-white">{lead.organization.name}</div>
                        <div className="text-[11px] text-gray-400">
                          {lead.organization.industry} • {lead.organization.country}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (lead.score?.totalScore ?? 0) >= 80
                                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                : 'bg-wine-700/30 text-wine-200 border border-wine-600/30'
                            }`}
                          >
                            {lead.score?.totalScore ?? 'N/A'}/100
                          </span>
                          <span className="text-[11px] text-gray-400">{lead.score?.classification}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate max-w-xs mt-0.5">
                          {lead.score?.explanation}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {lead.contact ? (
                          <div>
                            <div className="font-medium text-white">
                              {lead.contact.firstName} {lead.contact.lastName}
                            </div>
                            <div className="text-[11px] text-gray-400">{lead.contact.jobTitle}</div>
                            {lead.contact.email && (
                              <div className="text-[10px] text-emerald-400">{lead.contact.email}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">No contact found</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span className="px-2 py-1 rounded-md bg-surface-850 border border-wine-700/40 text-[11px] font-semibold text-gold-400">
                          {lead.pipelineStage}
                        </span>
                      </td>

                      <td className="py-4 px-5 max-w-xs">
                        <div className="text-gray-200 font-medium truncate">{lead.recommendedService}</div>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        <Link
                          href={`/outreach?leadId=${lead.id}`}
                          className="px-2.5 py-1 rounded bg-wine-700 hover:bg-wine-600 text-white font-semibold text-xs inline-flex items-center gap-1 transition"
                        >
                          <Send className="w-3 h-3" />
                          Pitch
                        </Link>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="px-2 py-1 rounded bg-surface-850 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-wine-900/40 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
