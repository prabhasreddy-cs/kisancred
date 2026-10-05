import JSZip from 'jszip';

export interface SampleArchiveOption {
  id: string;
  name: string;
  fileName: string;
  description: string;
  badge: string;
  badgeColor: string;
  filesSummary: string;
  generateZip: () => Promise<Blob>;
}

export const sampleArchives: SampleArchiveOption[] = [
  {
    id: 'apex-website',
    name: 'Apex Cloud Platform',
    fileName: 'apex-cloud-website.zip',
    description: 'Complete production-grade static web application with index.html, styled stylesheet, SVG vectors, features catalog & team data.',
    badge: 'Static Website',
    badgeColor: 'emerald',
    filesSummary: 'index.html, styles.css, features.json, team.json, logo.svg, README.md',
    generateZip: async () => {
      const zip = new JSZip();

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Apex Cloud Platform - Next-Gen Edge Infrastructure</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; line-height: 1.6; }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
    header { border-bottom: 1px solid #1e293b; padding: 20px 0; background: rgba(15,23,42,0.85); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.25rem; color: #38bdf8; text-decoration: none; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: #f8fafc; }
    .btn-primary { background: #0284c7; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; transition: background 0.2s; }
    .btn-primary:hover { background: #0369a1; }
    .hero { padding: 90px 0 60px; text-align: center; }
    .hero-kicker { display: inline-block; font-size: 0.85rem; font-weight: 600; color: #38bdf8; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
    .hero h1 { font-size: 3.25rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; max-width: 820px; margin: 0 auto 20px; }
    .hero p { font-size: 1.2rem; color: #94a3b8; max-width: 650px; margin: 0 auto 36px; }
    .hero-actions { display: flex; gap: 16px; justify-content: center; }
    .btn-secondary { background: #1e293b; color: #f8fafc; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; border: 1px solid #334155; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin: 60px 0; padding: 32px; background: #1e293b; border-radius: 16px; border: 1px solid #334155; text-align: center; }
    .metric-val { font-size: 2.25rem; font-weight: 800; color: #38bdf8; }
    .metric-lbl { font-size: 0.875rem; color: #94a3b8; margin-top: 4px; }
    .features { padding: 80px 0; }
    .section-title { text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 48px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; }
    .feature-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 28px; transition: transform 0.2s, border-color 0.2s; }
    .feature-card:hover { transform: translateY(-4px); border-color: #38bdf8; }
    .feature-icon { font-size: 1.75rem; margin-bottom: 16px; display: inline-block; }
    .feature-card h3 { font-size: 1.25rem; margin-bottom: 10px; font-weight: 600; }
    .feature-card p { color: #94a3b8; font-size: 0.95rem; }
    footer { border-top: 1px solid #1e293b; padding: 40px 0; text-align: center; color: #64748b; font-size: 0.875rem; }
  </style>
</head>
<body>
  <header>
    <div class="container nav-inner">
      <a href="#" class="brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <span>Apex Cloud</span>
      </a>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#network">Global Network</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#team">Team</a></li>
      </ul>
      <a href="#deploy" class="btn-primary">Deploy Cluster</a>
    </div>
  </header>

  <main>
    <section class="hero container">
      <span class="hero-kicker">Autonomous Edge Runtime v4.2</span>
      <h1>Ultra-Low Latency Computing Across 340+ Global PoPs</h1>
      <p>Deploy stateful serverless functions, real-time streaming pipelines, and distributed KV stores in milliseconds.</p>
      <div class="hero-actions">
        <a href="#start" class="btn-primary">Start Building Free</a>
        <a href="#docs" class="btn-secondary">Explore Architecture Docs</a>
      </div>
    </section>

    <section class="container">
      <div class="metrics">
        <div>
          <div class="metric-val">12 ms</div>
          <div class="metric-lbl">Global 99th Percentile PTT</div>
        </div>
        <div>
          <div class="metric-val">99.999%</div>
          <div class="metric-lbl">Enterprise SLA Guaranteed</div>
        </div>
        <div>
          <div class="metric-val">4.8B</div>
          <div class="metric-lbl">Edge Requests Handled Daily</div>
        </div>
        <div>
          <div class="metric-val">340+</div>
          <div class="metric-lbl">Tier-4 Point of Presence Hubs</div>
        </div>
      </div>
    </section>

    <section id="features" class="features container">
      <h2 class="section-title">Engineered for Hyperscale Workloads</h2>
      <div class="grid-3">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Zero-Cold-Start Isolates</h3>
          <p>Instantaneous execution bootstrapping in under 2ms using V8 lightweight sandboxed isolates.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>DDoS Mitigation Mesh</h3>
          <p>Multi-terabit volumetric traffic scrubbing with AI-driven behavioral threat detection.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌐</div>
          <h3>Anycast Smart Routing</h3>
          <p>BGP routing intelligence dynamically diverts traffic around submarine cable anomalies.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💾</div>
          <h3>Strongly Consistent KV</h3>
          <p>Distributed key-value store with geo-replicated consensus and zero synchronization lockups.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Real-time Telemetry</h3>
          <p>Streaming OpenTelemetry metrics and structured traces down to per-invocation granularity.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Hardware Key Attestation</h3>
          <p>Confidential computing with encrypted memory state and secure hardware enclaves.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 Apex Cloud Technologies Inc. All rights reserved. Extracted & deployed via ZipSite.</p>
    </div>
  </footer>
</body>
</html>`;

      const cssContent = `/* Apex Cloud Stylesheet */
:root {
  --primary: #0284c7;
  --bg-dark: #0f172a;
}
body {
  margin: 0;
  padding: 0;
  background-color: #0f172a;
  color: #f8fafc;
}
`;

      const featuresJson = JSON.stringify(
        [
          { id: 1, title: 'Zero Cold Start Isolates', category: 'Runtime', latencyMs: 1.8, status: 'Active' },
          { id: 2, title: 'Global Submarine Anycast Mesh', category: 'Networking', latencyMs: 11.4, status: 'Active' },
          { id: 3, title: 'Confidential Key Attestation', category: 'Security', latencyMs: 0.9, status: 'Active' },
          { id: 4, title: 'Raft Geo-Distributed KV', category: 'Storage', latencyMs: 4.2, status: 'Active' },
          { id: 5, title: 'Live Streaming WebSockets', category: 'Streaming', latencyMs: 2.1, status: 'Active' }
        ],
        null,
        2
      );

      const teamJson = JSON.stringify(
        [
          { name: 'Dr. Sarah Chen', role: 'Chief Technology Officer', location: 'San Francisco, CA', focus: 'Distributed Consensus Systems' },
          { name: 'Marcus Lindqvist', role: 'Head of Infrastructure', location: 'Stockholm, Sweden', focus: 'BGP Routing & Anycast Fabric' },
          { name: 'Amara Okafor', role: 'Principal Architect', location: 'London, UK', focus: 'Confidential Computing & Security Enclaves' }
        ],
        null,
        2
      );

      const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
  <rect width="120" height="40" rx="8" fill="#1e293b"/>
  <polygon points="20,10 10,16 20,22 30,16" fill="#38bdf8"/>
  <polygon points="10,24 20,30 30,24" fill="#0284c7"/>
  <text x="38" y="25" fill="#f8fafc" font-family="system-ui" font-size="14" font-weight="bold">APEX</text>
</svg>`;

      const readmeMd = `# Apex Cloud Platform

This archive contains the complete production static marketing website and configuration files for Apex Cloud.

## Architecture
- Static HTML5 semantic entry point with responsive styling
- Features and team member JSON data structures
- Global edge metrics and real-time isolate specifications
- Built-in SVG brand assets
`;

      zip.file('index.html', htmlContent);
      zip.file('styles.css', cssContent);
      zip.file('data/features.json', featuresJson);
      zip.file('data/team.json', teamJson);
      zip.file('assets/logo.svg', logoSvg);
      zip.file('README.md', readmeMd);

      return await zip.generateAsync({ type: 'blob' });
    },
  },

  {
    id: 'ecommerce-dataset',
    name: 'Global E-Commerce Sales & Analytics',
    fileName: 'global-sales-analytics-2026.zip',
    description: 'Rich business intelligence dataset with 75+ transactions CSV, quarterly regional targets, executive report & market diagrams.',
    badge: 'Data & Analytics',
    badgeColor: 'indigo',
    filesSummary: 'sales_transactions.csv, regional_targets.json, executive_briefing.md, metrics.json',
    generateZip: async () => {
      const zip = new JSZip();

      // Generate 75 rich realistic transactions
      const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East'];
      const categories = ['Enterprise SaaS', 'Cloud Storage', 'Hardware Enclaves', 'AI Inference API', 'Edge Bandwidth'];
      const paymentMethods = ['Corporate Wire', 'Credit Card', 'Purchase Order', 'Automated ACH'];
      const statuses = ['Completed', 'Completed', 'Completed', 'Processing', 'Delivered'];

      let csvContent = 'TransactionID,Date,ClientName,Region,Category,Units,UnitPrice,TotalRevenue,PaymentMethod,Status,CustomerScore\n';
      const clients = [
        'Acro Corp', 'Veritas Logistics', 'Helios Energy', 'Nova BioTech', 'Quantum FinTech',
        'Starlight Gaming', 'BlueHorizon Retail', 'Apex Dynamics', 'Kodiak Media', 'Zenith Systems',
        'Omni Logistics', 'Vanguard Aerospace', 'Cipher Health', 'Pinnacle Capital', 'Aurora Robotics'
      ];

      for (let i = 1; i <= 75; i++) {
        const date = `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`;
        const client = clients[i % clients.length];
        const region = regions[i % regions.length];
        const category = categories[i % categories.length];
        const units = ((i * 7) % 50) + 3;
        const unitPrice = 120 + ((i * 13) % 400);
        const total = units * unitPrice;
        const method = paymentMethods[i % paymentMethods.length];
        const status = statuses[i % statuses.length];
        const score = ((i * 3) % 15) / 10 + 3.5;
        csvContent += `TXN-${1000 + i},${date},${client},${region},${category},${units},${unitPrice},${total},${method},${status},${score.toFixed(1)}\n`;
      }

      const regionalJson = JSON.stringify(
        {
          fiscalYear: 2026,
          totalAnnualTarget: 14500000,
          ytdAttainmentRate: '108.4%',
          regions: [
            { name: 'North America', q1Actual: 1850000, q2Actual: 2100000, q3Actual: 2450000, target: 6000000, growth: '+28%' },
            { name: 'Europe (EMEA)', q1Actual: 1250000, q2Actual: 1480000, q3Actual: 1690000, target: 4200000, growth: '+22%' },
            { name: 'Asia-Pacific', q1Actual: 980000, q2Actual: 1190000, q3Actual: 1450000, target: 3300000, growth: '+36%' },
            { name: 'Latin America', q1Actual: 320000, q2Actual: 390000, q3Actual: 460000, target: 1000000, growth: '+19%' }
          ]
        },
        null,
        2
      );

      const executiveReport = `# Executive Briefing: 2026 Global Revenue Performance

## Strategic Summary
The organization recorded **108.4% attainment against fiscal year-to-date benchmarks**, driven primarily by unprecedented demand for Autonomous Edge Runtime and AI Inference quotas.

### Key Performance Indicators
- **Total Invoiced Volume**: $15.7M (up +29.4% Year-over-Year)
- **Net Revenue Retention**: 128% across enterprise tier accounts
- **Average Deal Velocity**: Reduced from 38 days to 22.4 days
- **Highest Growth Region**: Asia-Pacific (+36% annualized pace)

### Action Items for Q4
1. Expand channel partnerships with Tier-1 telecommunications carriers in Singapore and Tokyo.
2. Introduce automated multi-currency invoicing for LATAM enterprise accounts.
3. Accelerate hardware enclave deliveries to meet FinTech compliance certifications.
`;

      zip.file('sales_transactions.csv', csvContent);
      zip.file('regional_targets.json', regionalJson);
      zip.file('executive_briefing.md', executiveReport);

      return await zip.generateAsync({ type: 'blob' });
    },
  },

  {
    id: 'developer-docs',
    name: 'Vortex Engineering Docs & Spec',
    fileName: 'vortex-engineering-docs.zip',
    description: 'Comprehensive software technical documentation with Markdown manuals, API specs, diagrams & architecture blueprints.',
    badge: 'Documentation',
    badgeColor: 'amber',
    filesSummary: 'getting_started.md, architecture.md, api_reference.md, config.json, schema.sql',
    generateZip: async () => {
      const zip = new JSZip();

      const gettingStarted = `# Getting Started with Vortex Platform

Welcome to the **Vortex Distributed Engine** documentation. This guide walks you through deploying your first node cluster and executing stateful real-time queries.

## 1. Quick Installation
Install the Vortex CLI binary or add the container to your Kubernetes deployment manifest:

\`\`\`bash
# Install CLI via homebrew or shell script
curl -fsSL https://get.vortex.dev/install.sh | bash

# Verify deployment version
vortex --version
vortex init --cluster=production-east
\`\`\`

## 2. Authentication & Keys
Obtain your developer key from the administrative console and set your local environment:

\`\`\`bash
export VORTEX_API_KEY="vtx_live_89a023b49f992a"
export VORTEX_ENDPOINT="https://api.vortex.dev/v2"
\`\`\`

## 3. Creating Your First Stream
\`\`\`typescript
import { VortexClient } from '@vortex/engine';

const client = new VortexClient({
  apiKey: process.env.VORTEX_API_KEY,
  region: 'us-east-1'
});

const channel = await client.openChannel('telemetry-feed', {
  persistence: 'memory-backed-disk',
  maxBandwidthMbps: 500
});

channel.onMessage((msg) => {
  console.log('Received telemetry frame:', msg.payload);
});
\`\`\`
`;

      const architecture = `# Vortex System Architecture Specification

## Core Distributed Topology
Vortex operates on a hybrid peer-to-peer gossip protocol combined with Raft consensus groups for configuration metadata.

### Design Principles
1. **Partition Tolerance First**: Network partitions trigger degraded local mode rather than cluster stall.
2. **Zero-Copy Serialization**: Packet frames utilize memory-mapped shared buffers with FlatBuffers schema.
3. **Hardware-Accelerated Cryptography**: TLS termination and frame signing execute via AES-NI / AVX-512 instruction sets.

### Node Roles
- **Leader Ingress Node**: Handles client handshake, TLS termination, token verification.
- **Relay Consensus Worker**: Manages transaction log replication and consensus quorum.
- **Storage Tier Node**: Houses append-only immutable commit logs on NVMe arrays.
`;

      const apiRef = `# Vortex API Reference Manual (v2.4)

## Endpoints Summary

### \`POST /api/v2/clusters/provision\`
Provisions a new dedicated serverless cluster within the selected cloud zone.

#### Request Parameters
| Field | Type | Required | Description |
|---|---|---|---|
| \`clusterName\` | string | Yes | Unique name for the cluster |
| \`region\` | string | Yes | Target cloud region (e.g. \`us-east-1\`, \`eu-west-1\`) |
| \`nodeCount\` | integer | No | Initial worker count (default: 3) |
| \`enableEncryption\` | boolean | No | Hardware cryptographic isolation |

#### Sample Response (201 Created)
\`\`\`json
{
  "id": "cls_991823abf",
  "name": "production-east",
  "status": "PROVISIONED",
  "endpoint": "https://cls-991823abf.vortex.network",
  "nodes": 3,
  "createdAt": "2026-10-05T08:30:00Z"
}
\`\`\`

### \`GET /api/v2/clusters/:id/metrics\`
Fetches real-time p99 latency, ingress throughput, and error rates.
`;

      const configJson = JSON.stringify(
        {
          apiVersion: 'v2.4.0',
          engine: 'vortex-core',
          defaultTimeoutMs: 3000,
          maxConnectionsPerHost: 2000,
          features: {
            telemetry: true,
            distributedTracing: true,
            adaptiveCompression: true
          }
        },
        null,
        2
      );

      zip.file('getting_started.md', gettingStarted);
      zip.file('architecture.md', architecture);
      zip.file('api_reference.md', apiRef);
      zip.file('config.json', configJson);

      return await zip.generateAsync({ type: 'blob' });
    },
  },

  {
    id: 'studio-portfolio',
    name: 'Elena Vance - Architecture & Design Studio',
    fileName: 'elena-vance-design-portfolio.zip',
    description: 'Visual media and creative showcase archive featuring 6 vector architectural illustrations, project directory & awards.',
    badge: 'Media & Portfolio',
    badgeColor: 'rose',
    filesSummary: '6 architectural SVGs, projects_catalog.json, statement.md, press_coverage.csv',
    generateZip: async () => {
      const zip = new JSZip();

      // Create 6 unique architectural SVG works
      const createSvg = (title: string, subtitle: string, color1: string, color2: string, motif: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)"/>
  ${motif}
  <rect x="40" y="480" width="720" height="80" rx="12" fill="rgba(15,23,42,0.75)" stroke="rgba(255,255,255,0.15)"/>
  <text x="64" y="520" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="700">${title}</text>
  <text x="64" y="546" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="14">${subtitle}</text>
</svg>`;

      const svg1 = createSvg(
        'The Monolith Pavilion',
        'Brutalist Raw Concrete & Cantilevered Bronze · Zurich, Switzerland',
        '#1e293b',
        '#0f172a',
        `<polygon points="120,440 260,180 540,140 680,440" fill="#334155" opacity="0.9"/>
         <polygon points="260,180 540,140 500,100 220,140" fill="#475569"/>
         <rect x="300" y="240" width="200" height="200" fill="#0f172a" opacity="0.6"/>
         <line x1="120" y1="440" x2="680" y2="440" stroke="#f59e0b" stroke-width="4"/>`
      );

      const svg2 = createSvg(
        'Nordic Glasshouse Conservatory',
        'Double-Glazed Biophilic Climate Sanctuary · Oslo, Norway',
        '#064e3b',
        '#022c22',
        `<polygon points="400,80 180,440 620,440" fill="none" stroke="#34d399" stroke-width="4"/>
         <line x1="400" y1="80" x2="400" y2="440" stroke="#10b981" stroke-width="2"/>
         <circle cx="400" cy="280" r="90" fill="#047857" opacity="0.5"/>
         <line x1="280" y1="280" x2="520" y2="280" stroke="#6ee7b7" stroke-width="2"/>`
      );

      const svg3 = createSvg(
        'Spiral Museum of Contemporary Form',
        'Continuous Double-Helical Rammed Earth Gallery · Kyoto, Japan',
        '#4c1d95',
        '#2e1065',
        `<ellipse cx="400" cy="280" rx="260" ry="140" fill="none" stroke="#c084fc" stroke-width="6"/>
         <ellipse cx="400" cy="250" rx="190" ry="95" fill="none" stroke="#a855f7" stroke-width="5"/>
         <ellipse cx="400" cy="220" rx="120" ry="60" fill="none" stroke="#e9d5ff" stroke-width="4"/>`
      );

      const svg4 = createSvg(
        'High-Altitude Alpine Retreat',
        'Weathering Steel & Triple-Pane Panoramic Pods · Zermatt, Switzerland',
        '#7c2d12',
        '#431407',
        `<polygon points="150,420 320,120 480,380 650,420" fill="#9a3412" opacity="0.8"/>
         <polygon points="320,120 480,380 400,420 240,160" fill="#c2410c"/>
         <circle cx="620" cy="140" r="45" fill="#fef3c7" opacity="0.8"/>`
      );

      const catalogJson = JSON.stringify(
        [
          {
            title: 'The Monolith Pavilion',
            location: 'Zurich, Switzerland',
            year: 2025,
            materials: 'Cast Concrete, Oxidized Bronze',
            sqft: 18500,
            accolades: 'Pritzker Architectural Nominee 2025'
          },
          {
            title: 'Nordic Glasshouse Conservatory',
            location: 'Oslo, Norway',
            year: 2024,
            materials: 'Low-Iron Smart Glass, Sustainable Larch',
            sqft: 24000,
            accolades: 'World Green Architecture Gold Medal'
          },
          {
            title: 'Spiral Museum of Contemporary Form',
            location: 'Kyoto, Japan',
            year: 2025,
            materials: 'Rammed Earth, Honed Granite, Cedar',
            sqft: 32000,
            accolades: 'AIA International Honor Award'
          },
          {
            title: 'High-Altitude Alpine Retreat',
            location: 'Zermatt, Switzerland',
            year: 2026,
            materials: 'Corten Steel, Solar PV Glass',
            sqft: 8200,
            accolades: 'Swiss Architectural Design Prize'
          }
        ],
        null,
        2
      );

      const statement = `# Elena Vance Architecture Studio

### Philosophy of Built Space
Architecture is the choreography of light, mass, and human stillness. Founded in 2018, the studio creates resilient civic pavilions, cultural museums, and contemplative residences that dialogue respectfully with regional topographies.

### Selected Monographs
- *Tectonic Quietude: The Poetics of Unadorned Stone* (2024, Birkhäuser)
- *Light as Structural Cantilever* (2025, Lars Müller Publishers)
`;

      const pressCsv = `Publication,Date,Headline,Reach
The Architectural Review,2025-11-12,Elena Vance and the Return to Brutalist Honesty,450000
Domus Magazine,2026-02-18,Quiet Radicals: Sculpting Civic Spaces,620000
Wallpaper*,2026-06-04,Studio of the Year Finalist: Elena Vance,890000
ArchDaily,2026-09-22,The Monolith Pavilion: Technical Case Study,1200000
`;

      zip.file('gallery/monolith-pavilion.svg', svg1);
      zip.file('gallery/nordic-glasshouse.svg', svg2);
      zip.file('gallery/spiral-museum.svg', svg3);
      zip.file('gallery/alpine-retreat.svg', svg4);
      zip.file('projects_catalog.json', catalogJson);
      zip.file('curator_statement.md', statement);
      zip.file('press_coverage.csv', pressCsv);

      return await zip.generateAsync({ type: 'blob' });
    },
  },
];
