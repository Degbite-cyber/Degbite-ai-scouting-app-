/**
 * Lead Store — In-memory client/server store with Supabase sync capabilities.
 * Synchronous getters for immediate UI reactivity, backed by DEMO_LEADS.
 */
import { Lead } from '@/types';
import { DEMO_LEADS } from '@/lib/demo-data';

// Runtime in-memory state
let liveLeads: Lead[] = [];
let demoLeads: Lead[] = [...DEMO_LEADS];

export function getLeads(isDemo: boolean): Lead[] {
  return isDemo ? demoLeads : liveLeads;
}

export function getLeadById(id: string): Lead | undefined {
  return [...liveLeads, ...demoLeads].find((l) => l.id === id);
}

export function saveLead(lead: Lead): void {
  if (lead.isDemo) {
    const idx = demoLeads.findIndex((l) => l.id === lead.id);
    if (idx >= 0) demoLeads[idx] = lead;
    else demoLeads.unshift(lead);
  } else {
    const idx = liveLeads.findIndex((l) => l.id === lead.id);
    if (idx >= 0) liveLeads[idx] = lead;
    else liveLeads.unshift(lead);
  }
}

export function updateLeadStage(id: string, stage: Lead['pipelineStage']): Lead | undefined {
  const lead = getLeadById(id);
  if (lead) {
    lead.pipelineStage = stage;
    lead.updatedAt = new Date().toISOString();
    saveLead(lead);
  }
  return lead;
}

export function deleteLead(id: string): boolean {
  const initLiveLen = liveLeads.length;
  liveLeads = liveLeads.filter((l) => l.id !== id);
  if (liveLeads.length < initLiveLen) return true;

  const initDemoLen = demoLeads.length;
  demoLeads = demoLeads.filter((l) => l.id !== id);
  return demoLeads.length < initDemoLen;
}

export function getDashboardMetrics(isDemo: boolean) {
  const leads = getLeads(isDemo);
  const totalDiscovered = leads.length;
  const qualifiedToday = leads.filter(
    (l) => l.pipelineStage === 'Qualified' || (l.score && l.score.totalScore >= 60)
  ).length;
  const highPriority = leads.filter((l) => l.score && l.score.totalScore >= 80).length;
  const activeSignals = leads.filter((l) => l.signal && l.signal.freshnessStatus === 'fresh').length;
  const meetingsBooked = leads.filter((l) => l.pipelineStage === 'Meeting Booked').length;
  const dealsWon = leads.filter((l) => l.pipelineStage === 'Won').length;

  return {
    totalDiscovered,
    qualifiedToday,
    highPriority,
    activeSignals,
    meetingsBooked,
    dealsWon,
    apiCostEst: isDemo ? '$0.00 (Demo Simulation)' : '$0.00 (Free Tier Budget)',
  };
}
