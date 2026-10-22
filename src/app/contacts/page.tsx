'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  UserCheck,
  Building,
  Mail,
  Linkedin,
  ShieldCheck,
  Search,
  ExternalLink,
  Send,
} from 'lucide-react';
import Link from 'next/link';

interface ContactItem {
  id: string;
  name: string;
  jobTitle: string;
  companyName: string;
  industry: string;
  country: string;
  email?: string;
  linkedinUrl?: string;
  verificationStatus: 'verified' | 'provider_reported';
}

const CONTACTS: ContactItem[] = [
  {
    id: 'cnt-1',
    name: 'Sarah Jenkins',
    jobTitle: 'Head of Growth Marketing',
    companyName: 'Aura Glow Cosmetics',
    industry: 'E-commerce & DTC',
    country: 'United States',
    email: 'sarah.j@auraglowcosmetics.com',
    linkedinUrl: 'https://linkedin.com/in/sarah-jenkins-marketing',
    verificationStatus: 'verified',
  },
  {
    id: 'cnt-2',
    name: 'Marcus Sterling',
    jobTitle: 'VP of Product Marketing',
    companyName: 'CloudSync Technologies',
    industry: 'SaaS & Tech',
    country: 'United Kingdom',
    email: 'm.sterling@cloudsync.io',
    linkedinUrl: 'https://linkedin.com/in/marcussterling',
    verificationStatus: 'provider_reported',
  },
  {
    id: 'cnt-3',
    name: 'Jessica Miller',
    jobTitle: 'VP of Growth & Acquisition',
    companyName: 'LuxeGlow Cosmetics',
    industry: 'E-commerce & DTC',
    country: 'United States',
    email: 'jessica.m@luxeglowbeauty.com',
    linkedinUrl: 'https://linkedin.com/in/jessica-miller-growth',
    verificationStatus: 'verified',
  },
  {
    id: 'cnt-4',
    name: 'Liam Carter',
    jobTitle: 'Founder & Managing Director',
    companyName: 'Apex Media Growth',
    industry: 'Marketing agencies',
    country: 'Australia',
    email: 'liam@apexmediagrowth.com',
    linkedinUrl: 'https://linkedin.com/in/liam-carter-agency',
    verificationStatus: 'verified',
  },
];

export default function ContactsPage() {
  const [isDemo, setIsDemo] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100">
      <Sidebar isDemo={isDemo} setIsDemo={setIsDemo} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-wine-800/30 px-8 flex items-center justify-between bg-surface-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg text-white">Decision-Maker Directory</h2>
            <span className="badge-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gold-400">
              Verified Buying Contacts
            </span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search contacts or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-850 border border-wine-700/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="rounded-xl card-luxury overflow-hidden border border-wine-800/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-900/90 text-gray-400 uppercase tracking-wider text-[10px] border-b border-wine-800/30">
                  <tr>
                    <th className="py-3 px-5">Name & Job Title</th>
                    <th className="py-3 px-5">Company & Industry</th>
                    <th className="py-3 px-5">Verified Email</th>
                    <th className="py-3 px-5">Social Profile</th>
                    <th className="py-3 px-5">Verification State</th>
                    <th className="py-3 px-5 text-right">Outreach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wine-800/20 text-gray-300">
                  {filteredContacts.map((cnt) => (
                    <tr key={cnt.id} className="hover:bg-wine-900/20 transition">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm">{cnt.name}</div>
                        <div className="text-[11px] text-gray-400">{cnt.jobTitle}</div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-medium text-gray-200">{cnt.companyName}</div>
                        <div className="text-[11px] text-gray-400">
                          {cnt.industry} • {cnt.country}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {cnt.email ? (
                          <span className="text-emerald-400 font-mono text-[11px]">{cnt.email}</span>
                        ) : (
                          <span className="text-gray-500 italic">Not available</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        {cnt.linkedinUrl ? (
                          <a
                            href={cnt.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                          >
                            <Linkedin className="w-3 h-3 text-[#0A66C2]" />
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">No link</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cnt.verificationStatus === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          }`}
                        >
                          {cnt.verificationStatus === 'verified' ? 'Verified Match' : 'Provider Reported'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/outreach`}
                          className="px-3 py-1 rounded-md bg-wine-700 hover:bg-wine-600 text-white font-semibold text-xs inline-flex items-center gap-1 transition"
                        >
                          <Send className="w-3 h-3" />
                          Pitch
                        </Link>
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
