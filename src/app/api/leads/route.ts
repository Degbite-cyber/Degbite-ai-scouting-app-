import { NextResponse } from 'next/server';
import { getLeads, saveLead, getDashboardMetrics } from '@/lib/lead-store';
import { Lead } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDemo = searchParams.get('demo') === 'true';

    const leads = getLeads(isDemo);
    const metrics = getDashboardMetrics(isDemo);

    return NextResponse.json({
      success: true,
      leads,
      metrics,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead: Lead = body.lead;

    if (!lead || !lead.company?.name) {
      return NextResponse.json(
        { success: false, error: 'Valid lead structure is required.' },
        { status: 400 }
      );
    }

    saveLead(lead);

    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead saved successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
