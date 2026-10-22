import { Lead, OutreachDraft } from '@/types';

export interface GenerateOutreachParams {
  lead: Lead;
  channel: 'email' | 'linkedin' | 'follow_up';
  tone: 'professional' | 'friendly' | 'direct' | 'consultative';
}

export function generatePersonalizedDraft({
  lead,
  channel,
  tone,
}: GenerateOutreachParams): OutreachDraft {
  const contactName = lead.contact?.firstName || 'there';
  const orgName = lead.organization.name;
  const signalEvidence = lead.signal?.evidenceSummary || 'your recent creative initiatives';
  const serviceOffer = lead.recommendedService;

  let subject = '';
  let body = '';
  let valueProposition = '';

  if (channel === 'email') {
    if (tone === 'consultative') {
      subject = `Scaling video production at ${orgName} without adding headcount`;
      body = `Hi ${contactName},

I noticed ${orgName}'s recent initiative regarding: "${signalEvidence}".

As an AI video automation specialist, I build custom workflows (combining n8n, AI voice cloning, and programmatic video rendering) that allow teams like yours to produce 20–40 high-performing video creatives each month on autopilot.

Given your focus on ${lead.organization.industry}, we could set up an automated system that handles:
• Automated script variations based on top angles
• Programmatic rendering for multi-format distribution (Reels, TikTok, Shorts)
• Direct integration into your existing tech stack without manual editing bottlenecks

Would you be open to a 10-minute walk-through of an automated video pipeline I built for a similar brand?

Best regards,

David Adegbite
AI Video Automation Specialist | DA Automations
https://calendly.com/adegbitedavid90/30min`;
    } else {
      subject = `Quick question regarding ${orgName}'s video automation`;
      body = `Hi ${contactName},

Reaching out directly after seeing that ${orgName} is looking to scale video output ("${signalEvidence}").

I specialize in building turnkey AI video pipelines using n8n and generative video engines that generate high-converting video variations at 1/5th the standard agency turnaround time.

Are you open to seeing a 2-minute custom sample video we could automate for ${orgName}?

Best,
David Adegbite`;
    }
    valueProposition = 'Produce 20-40 automated video variations per month at high speed with zero manual editing fatigue.';
  } else if (channel === 'linkedin') {
    subject = 'LinkedIn Direct InMail / Connection Note';
    body = `Hi ${contactName} — caught your recent update regarding ${signalEvidence.slice(0, 80)}...

I help leaders in ${lead.organization.industry} automate their entire video content pipeline using n8n and AI rendering engines. Would love to share how we eliminate 80% of video production hours. Worth a brief connection?`;
    valueProposition = 'Streamline video content production via custom n8n workflows.';
  } else {
    subject = `Re: Automated video pipeline for ${orgName}`;
    body = `Hi ${contactName},

Circling back on this. I know you're busy scaling creative initiatives at ${orgName}.

I put together a quick preview outline showing how an automated n8n video workflow would plug directly into your current process: ${serviceOffer}.

Let me know if you'd like me to send over the loom breakdown.

Best,
David`;
    valueProposition = 'Follow-up showcasing direct implementation workflow.';
  }

  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    leadId: lead.id,
    channel,
    tone,
    subject,
    body,
    valueProposition,
    suggestedOffer: serviceOffer,
    isApproved: false,
  };
}
