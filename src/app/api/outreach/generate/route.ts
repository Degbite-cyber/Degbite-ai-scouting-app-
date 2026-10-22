import { NextResponse } from 'next/server';
import { getLeadById } from '@/lib/lead-store';
import { generatePersonalizedDraft } from '@/lib/outreach-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, channel, tone } = body;

    const lead = getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 });
    }

    const draft = generatePersonalizedDraft({
      lead,
      channel: channel || 'email',
      tone: tone || 'consultative',
    });

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
