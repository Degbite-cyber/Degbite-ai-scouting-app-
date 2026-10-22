import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/lead-store';
import { Lead } from '@/types';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET || 'scout-n8n-token-secret-2026';

    // Verify token if secret configured
    if (authHeader && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized n8n webhook token.' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const leads: Lead[] = Array.isArray(payload)
      ? payload
      : payload.leads
      ? payload.leads
      : [payload];

    let ingested = 0;
    for (const lead of leads) {
      if (lead && lead.company?.name) {
        await saveLead(lead);
        ingested++;
      }
    }

    return NextResponse.json({
      success: true,
      ingested,
      message: `Successfully ingested ${ingested} leads from n8n automation workflow.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
