# AI Video Buyer Scout — Production System Guide
**Personal B2B Client Acquisition & Buying-Signal Scout for David Adegbite (DA Automations)**

---

## 1. What Has Been Built & Tested

### A. Core Architecture & Styling
- **Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, and Node.js LTS v24.
- **Brand Identity**: Custom palette matching your website (`#6E0F21` deep wine, `#F59E0B` amber gold, and `#13080C` / `#1A0D13` luxury dark surfaces) with `Plus Jakarta Sans` and `Space Grotesk` typography.
- **Separation of Modes**: Live Production Mode and Sandbox Demo Mode are separated, ensuring demo data never pollutes live statistics.

### B. Database & Schema
- Full 20-table PostgreSQL schema in [`supabase/migrations/001_initial_schema.sql`](file:///C:/Users/USER/.gemini/antigravity/scratch/ai-video-buyer-scout/supabase/migrations/001_initial_schema.sql) with Row-Level Security (RLS) policies, foreign key indexes, domain normalization, and full audit tables.

### C. Buyer Discovery Engine (`/discovery`)
- Modular provider architecture supporting:
  - **Sandbox Verified Feed (`mock_sandbox`)**: Zero-cost, deterministic, realistic buying signal candidates.
  - **Apollo.io B2B Search (`apollo`)**: Search via Apollo API.
- Filterable by Target Niches (E-commerce DTC, Marketing Agencies, SaaS & Tech, Real Estate) and Priority Geographies (US, UK, UAE, Australia, Canada, Germany).

### D. 100-Point Transparent AI Qualification Model
- Every discovered prospect is scored against an explainable rubric:
  - **Buying Signal Strength**: up to 35 pts (explicit RFP/hiring vs. general need).
  - **AI Video Service Relevance**: up to 25 pts (n8n automations, UGC ads, product tours).
  - **Decision-Maker Identification**: up to 15 pts.
  - **Commercial Fit & Company Size**: up to 15 pts.
  - **Signal Freshness**: up to 10 pts.
- Automatically assigns the optimal AI video service offer and next strategic action.

### E. CRM Sales Pipeline (`/pipeline`)
- Interactive stage progression: `Discovered` → `Qualified` → `Ready for Outreach` → `Contacted` → `Replied` → `Meeting Booked` → `Proposal Sent` → `Won`.

### F. Grounded Personalized Outreach Studio (`/outreach`)
- Generates evidence-grounded copy (Cold Email, LinkedIn InMail, Follow-Up) tailored to each lead's specific buying evidence.
- Configurable tone (Consultative, Professional, Friendly).
- **Human Approval Requirement**: Requires manual approval by default before dispatch.

### G. n8n Automation Workflows
Importable JSON workflows in the [`n8n/`](file:///C:/Users/USER/.gemini/antigravity/scratch/ai-video-buyer-scout/n8n/) folder:
1. `workflow_a_daily_buyer_discovery.json`: Scheduled automated daily scouting synced to `/api/n8n/webhook`.
2. `workflow_c_daily_buyer_digest.json`: Daily evening digest of high-priority opportunities.

---

## 2. Verification & Build Results

Production build status: **`✓ Compiled successfully` (Exit Code 0)**.

| Route | Type | Purpose |
| :--- | :--- | :--- |
| `/` | Static | Executive Overview Dashboard with live metrics & qualification table |
| `/discovery` | Static | Parameterized worldwide buyer scout |
| `/leads` | Static | Filterable qualified opportunities database |
| `/outreach` | Static (Suspense-wrapped) | Personalized pitch drafting & copy approval |
| `/pipeline` | Static | Kanban sales pipeline & deal management |
| `/api/discovery` | Dynamic API | Discovery job execution endpoint |
| `/api/leads` | Dynamic API | Lead CRUD operations |
| `/api/outreach/generate` | Dynamic API | AI pitch generator |
| `/api/n8n/webhook` | Dynamic API | Secure authenticated ingestion for n8n |

---

## 3. How to Run Locally

In your PowerShell terminal:

```powershell
# 1. Navigate to the project directory
cd "C:\Users\USER\.gemini\antigravity\scratch\ai-video-buyer-scout"

# 2. Add Node to your current session PATH
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# 3. Start the Next.js development server
npm run dev
```
Then open your browser to [http://localhost:3000](http://localhost:3000).
