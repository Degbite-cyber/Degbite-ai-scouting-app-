import { NextResponse } from 'next/server';
import {
  MockSandboxProvider,
  ApolloApiProvider,
  DiscoverySearchParams,
} from '@/lib/providers/discovery-engine';
import { transformRecordToLead } from '@/lib/providers/qualification-engine';
import { saveLead } from '@/lib/lead-store';

export async function POST(request: Request) {
  try {
    const body: DiscoverySearchParams = await request.json();
    const isDemo = body.isDemo ?? false;

    let provider = new MockSandboxProvider();
    if (body.provider === 'apollo') {
      const apollo = new ApolloApiProvider();
      if (!apollo.isAvailable()) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Apollo API key is not configured in .env.local. Switch to Sandbox Demo mode or configure APOLLO_API_KEY.',
          },
          { status: 400 }
        );
      }
      // @ts-ignore
      provider = apollo;
    }

    const records = await provider.search(body);
    const qualifiedLeads = records.map((rec) => transformRecordToLead(rec, isDemo));

    // Save all to store/database concurrently
    await Promise.all(qualifiedLeads.map((l) => saveLead(l)));

    return NextResponse.json({
      success: true,
      discoveredCount: records.length,
      leads: qualifiedLeads,
      provider: provider.name,
      isDemo,
      message: `Successfully discovered and qualified ${qualifiedLeads.length} leads.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
