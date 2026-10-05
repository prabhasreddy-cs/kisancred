import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileCode,
  Play,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { AgriculturalRecord, CreditApplication, Farmer } from '../types/kisancred';

interface ApiSandboxProps {
  farmers: Farmer[];
  records: AgriculturalRecord[];
  credits: CreditApplication[];
}

interface EndpointDef {
  id: string;
  tag: 'Farmers' | 'Verifications' | 'Credits';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  defaultPayload?: any;
}

const ENDPOINTS: EndpointDef[] = [
  // Farmers
  {
    id: 'get-farmers',
    tag: 'Farmers',
    method: 'GET',
    path: '/api/v1/farmers/',
    summary: 'List all farmers',
    description: 'Retrieve paginated list of all enrolled smallholder and marginal farmers with land size and credit score.',
  },
  {
    id: 'post-farmers',
    tag: 'Farmers',
    method: 'POST',
    path: '/api/v1/farmers/',
    summary: 'Create a new farmer',
    description: 'Enroll a new farmer profile with personal KYC information, phone, village, and land size.',
    defaultPayload: {
      name: 'Jagdish Chandra Sharma',
      email: 'jagdish.sharma@kisanmail.in',
      phone: '+91 98270 55190',
      address: 'Khasra No. 89, Gram Bairagarh',
      village: 'Bairagarh',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      land_size_acres: 3.8,
      farming_experience_years: 12,
    },
  },
  {
    id: 'get-farmer-detail',
    tag: 'Farmers',
    method: 'GET',
    path: '/api/v1/farmers/{farmer_id}',
    summary: 'Get farmer details',
    description: 'Fetch detailed farmer identity including relationship links to historical agricultural records and loans.',
  },
  {
    id: 'put-farmer',
    tag: 'Farmers',
    method: 'PUT',
    path: '/api/v1/farmers/{farmer_id}',
    summary: 'Update farmer information',
    description: 'Update phone number, address, or land size records for an existing farmer.',
    defaultPayload: {
      phone: '+91 98261 44521',
      address: 'Survey No. 42 (Updated), Gram Pipliya',
      land_size_acres: 4.8,
    },
  },
  {
    id: 'delete-farmer',
    tag: 'Farmers',
    method: 'DELETE',
    path: '/api/v1/farmers/{farmer_id}',
    summary: 'Delete a farmer',
    description: 'Soft-delete or deactivate a farmer profile if no active outstanding loans exist.',
  },

  // Verifications
  {
    id: 'get-verifications',
    tag: 'Verifications',
    method: 'GET',
    path: '/api/v1/verifications/',
    summary: 'List agricultural records',
    description: 'List all seasonal harvest records across Kharif, Rabi, and Zaid with verification status.',
  },
  {
    id: 'post-verifications',
    tag: 'Verifications',
    method: 'POST',
    path: '/api/v1/verifications/',
    summary: 'Create agricultural record',
    description: 'Submit a new crop yield harvest entry with quintals produced, gross income, and parcel geo-coordinates.',
    defaultPayload: {
      farmer_id: 'FMR-101',
      crop_type: 'Gram / Chickpea (JG-11)',
      season: 'Rabi',
      year: 2026,
      production_quantity_quintals: 45.0,
      gross_income: 245000.0,
      geo_coordinates: '24.0812° N, 75.0921° E',
      soil_health_index: 'Optimal (pH 7.3)',
    },
  },
  {
    id: 'get-verification-detail',
    tag: 'Verifications',
    method: 'GET',
    path: '/api/v1/verifications/{record_id}',
    summary: 'Get record details',
    description: 'Retrieve full agricultural audit trail for a specific seasonal harvest record.',
  },
  {
    id: 'post-verification-verify',
    tag: 'Verifications',
    method: 'POST',
    path: '/api/v1/verifications/{record_id}/verify',
    summary: 'Verify an agricultural record',
    description: 'FPO verification officer digitally stamps and verifies an agricultural record.',
    defaultPayload: {
      officer_name: 'Dr. Vivek Sharma (FPO-Central-08)',
      status: 'approved',
      verification_notes: 'Physical weighment verified at APMC mandi yard. Grain moisture content tested at 10.4%.',
    },
  },
  {
    id: 'put-verifications',
    tag: 'Verifications',
    method: 'PUT',
    path: '/api/v1/verifications/{record_id}',
    summary: 'Update record',
    description: 'Update crop production figures or mandi sale receipt reference numbers.',
    defaultPayload: {
      production_quantity_quintals: 75.0,
      gross_income: 360000.0,
    },
  },
  {
    id: 'delete-verifications',
    tag: 'Verifications',
    method: 'DELETE',
    path: '/api/v1/verifications/{record_id}',
    summary: 'Delete a record',
    description: 'Remove an unverified or errant crop record entry.',
  },

  // Credit Applications
  {
    id: 'get-credits',
    tag: 'Credits',
    method: 'GET',
    path: '/api/v1/credits/',
    summary: 'List credit applications',
    description: 'List all farmer credit requests, underwriting evaluations, and disbursement statuses.',
  },
  {
    id: 'post-credits',
    tag: 'Credits',
    method: 'POST',
    path: '/api/v1/credits/',
    summary: 'Create credit application',
    description: 'Submit an agricultural loan request based on verified seasonal performance records.',
    defaultPayload: {
      farmer_id: 'FMR-101',
      amount_requested: 200000.0,
      purpose: 'Solar Water Pump Subvention and Drip Irrigation Implements',
      repayment_terms_months: 12,
      repayment_structure: 'bullet_post_harvest',
    },
  },
  {
    id: 'get-credit-detail',
    tag: 'Credits',
    method: 'GET',
    path: '/api/v1/credits/{application_id}',
    summary: 'Get application details',
    description: 'Retrieve credit underwriting decision parameters, LTV ratio, and repayment schedule.',
  },
  {
    id: 'put-credits',
    tag: 'Credits',
    method: 'PUT',
    path: '/api/v1/credits/{application_id}',
    summary: 'Update application',
    description: 'Update credit application status (e.g. approved, disbursed, repaid).',
    defaultPayload: {
      status: 'approved',
      amount_approved: 200000.0,
      interest_rate: 4.0,
    },
  },
];

export const ApiSandbox: React.FC<ApiSandboxProps> = ({
  farmers,
  records,
  credits,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [selectedTag, setSelectedTag] = useState<'All' | 'Farmers' | 'Verifications' | 'Credits'>('All');
  const [paramId, setParamId] = useState<string>('FMR-101');
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify(ENDPOINTS[0].defaultPayload || {}, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [responseTimeMs, setResponseTimeMs] = useState<number>(42);
  const [copied, setCopied] = useState(false);

  const filteredEndpoints = ENDPOINTS.filter(
    (ep) => selectedTag === 'All' || ep.tag === selectedTag
  );

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setPayloadText(JSON.stringify(ep.defaultPayload || {}, null, 2));

    if (ep.tag === 'Farmers') setParamId(farmers[0]?.id || 'FMR-101');
    else if (ep.tag === 'Verifications') setParamId(records[0]?.id || 'REC-2025-001');
    else setParamId(credits[0]?.id || 'CRD-2026-801');

    setResponseOutput(null);
  };

  const handleExecute = () => {
    const startTime = performance.now();

    let result: any = null;
    let status = 200;

    switch (selectedEndpoint.id) {
      case 'get-farmers':
        result = {
          total: farmers.length,
          page: 1,
          limit: 50,
          farmers: farmers.map((f) => ({
            id: f.id,
            name: f.name,
            email: f.email,
            phone: f.phone,
            village: f.village,
            district: f.district,
            state: f.state,
            land_size_acres: f.landSizeAcres,
            credit_score: f.creditScore,
            kyc_verified: f.kycVerified,
          })),
        };
        break;

      case 'post-farmers':
        status = 201;
        try {
          const body = JSON.parse(payloadText);
          result = {
            message: 'Farmer profile created successfully',
            farmer: {
              id: `FMR-${Math.floor(200 + Math.random() * 800)}`,
              ...body,
              kyc_verified: true,
              credit_score: 720,
              created_at: new Date().toISOString(),
            },
          };
        } catch {
          result = { error: 'Invalid JSON payload' };
          status = 400;
        }
        break;

      case 'get-farmer-detail':
        const targetFarmer = farmers.find((f) => f.id === paramId) || farmers[0];
        result = {
          farmer: targetFarmer,
          agricultural_records: records.filter((r) => r.farmerId === targetFarmer.id),
          credit_applications: credits.filter((c) => c.farmerId === targetFarmer.id),
        };
        break;

      case 'get-verifications':
        result = {
          total: records.length,
          records: records,
        };
        break;

      case 'post-verifications':
        status = 201;
        try {
          const body = JSON.parse(payloadText);
          result = {
            message: 'Agricultural record created. Queued for FPO verification.',
            record: {
              id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
              ...body,
              status: 'pending',
              created_at: new Date().toISOString(),
            },
          };
        } catch {
          result = { error: 'Invalid JSON payload' };
          status = 400;
        }
        break;

      case 'post-verification-verify':
        result = {
          message: `Record ${paramId} verified and signed by FPO officer.`,
          record_id: paramId,
          status: 'approved',
          verified_by: 'Dr. Vivek Sharma (FPO-Central-08)',
          timestamp: new Date().toISOString(),
          unlocked_credit_ceiling: 420000,
        };
        break;

      case 'get-credits':
        result = {
          total: credits.length,
          applications: credits,
        };
        break;

      case 'post-credits':
        status = 201;
        result = {
          message: 'Credit application submitted. Underwriting engine calculated pre-approval.',
          application: {
            id: `CRD-2026-${Math.floor(820 + Math.random() * 150)}`,
            status: 'under_underwriting',
            amount_approved: 180000,
            interest_rate: 4.0,
            created_at: new Date().toISOString(),
          },
        };
        break;

      default:
        result = {
          success: true,
          endpoint: selectedEndpoint.path,
          method: selectedEndpoint.method,
          resource_id: paramId,
          timestamp: new Date().toISOString(),
        };
    }

    const duration = Math.max(12, Math.round(performance.now() - startTime + Math.random() * 25));
    setResponseTimeMs(duration);
    setResponseStatus(status);
    setResponseOutput(result);
  };

  const handleCopyResponse = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              FastAPI Interactive API Explorer
            </h1>
            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
              v1.0.0 OpenAPI
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Interactive Swagger UI playground simulating the Python FastAPI endpoints at <code className="font-mono text-slate-700">http://0.0.0.0:8000/docs</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SQLite Connected: agricultural_credit.db</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Endpoints List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
          {/* Tag Filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-600 mb-2">
            {(['All', 'Farmers', 'Verifications', 'Credits'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                  selectedTag === tag ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              const methodColor =
                ep.method === 'GET'
                  ? 'bg-sky-100 text-sky-800 border-sky-200'
                  : ep.method === 'POST'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : ep.method === 'PUT'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border ${
                      isSelected ? 'bg-white/20 text-white border-white/20' : methodColor
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold truncate">{ep.path}</span>
                  </div>
                  <div className={`text-xs truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {ep.summary}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Request / Response Playground */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Endpoint Info Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-sky-100 text-sky-800 border-sky-200'
                      : selectedEndpoint.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedEndpoint.path}</span>
                </div>
                <p className="text-xs text-slate-600">{selectedEndpoint.description}</p>
              </div>

              <button
                type="button"
                onClick={handleExecute}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute</span>
              </button>
            </div>

            {/* Path Parameters (if endpoint has {id}) */}
            {selectedEndpoint.path.includes('{') && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Path Parameter (Resource ID)
                </label>
                <input
                  type="text"
                  value={paramId}
                  onChange={(e) => setParamId(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono text-xs rounded-lg border border-slate-200 bg-white"
                  placeholder="e.g. FMR-101 or REC-2025-001"
                />
              </div>
            )}

            {/* Request Body (for POST/PUT) */}
            {['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Request Body (JSON Schema)</span>
                  <span className="font-mono text-slate-400 text-[11px]">application/json</span>
                </div>
                <textarea
                  rows={5}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Response Inspector */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">Response</span>
                {responseOutput && (
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      responseStatus < 300 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {responseStatus} OK
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{responseTimeMs}ms</span>
                  </div>
                )}
              </div>

              {responseOutput && (
                <button
                  type="button"
                  onClick={handleCopyResponse}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            <div className="p-4 overflow-x-auto max-h-[360px] font-mono text-xs leading-relaxed">
              {responseOutput ? (
                <pre>
                  <code>{JSON.stringify(responseOutput, null, 2)}</code>
                </pre>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  Click "Execute" above to test this FastAPI endpoint against the live in-memory database.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
