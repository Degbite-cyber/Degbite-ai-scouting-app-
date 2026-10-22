import { NextResponse } from 'next/server';
import { transformRecordToLead } from '@/lib/providers/qualification-engine';
import { saveLead } from '@/lib/lead-store';
import { RawDiscoveryRecord } from '@/lib/providers/discovery-engine';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const isDemo = formData.get('isDemo') === 'true';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No CSV file provided.' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: 'CSV file must contain a header row and at least one data row.' },
        { status: 400 }
      );
    }

    // Parse header
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));

    const records: RawDiscoveryRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV parser accounting for simple quotes
      const row = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (row.length < 2) continue;

      const recordMap: Record<string, string> = {};
      headers.forEach((h, idx) => {
        recordMap[h] = row[idx] || '';
      });

      const companyName =
        recordMap['company'] ||
        recordMap['company_name'] ||
        recordMap['company name'] ||
        row[0];
      const website =
        recordMap['website'] ||
        recordMap['url'] ||
        recordMap['domain'] ||
        `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
      const industry = recordMap['industry'] || 'Marketing agencies';
      const country = recordMap['country'] || 'United States';
      const decisionMakerName =
        recordMap['contact'] || recordMap['name'] || recordMap['decision_maker'] || '';
      const decisionMakerTitle = recordMap['title'] || recordMap['job_title'] || 'Founder';
      const decisionMakerEmail = recordMap['email'] || '';
      const signalSnippet =
        recordMap['signal'] ||
        recordMap['evidence'] ||
        'Imported via CSV lead list for AI video outreach';

      records.push({
        companyName,
        website: website.startsWith('http') ? website : `https://${website}`,
        industry,
        country,
        decisionMakerName: decisionMakerName || undefined,
        decisionMakerTitle,
        decisionMakerEmail: decisionMakerEmail || undefined,
        signalSnippet,
        signalCategory: 'strong_need',
        sourceName: 'User CSV Import',
      });
    }

    const qualifiedLeads = records.map((rec) => transformRecordToLead(rec, isDemo));
    // Save all concurrently
    await Promise.all(qualifiedLeads.map((l) => saveLead(l)));

    return NextResponse.json({
      success: true,
      importedCount: qualifiedLeads.length,
      leads: qualifiedLeads,
      message: `Successfully imported and qualified ${qualifiedLeads.length} leads from CSV.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
