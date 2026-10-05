import React from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  FileSpreadsheet,
  Globe,
  Landmark,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { ActiveTab, AgriculturalRecord, CreditApplication, Farmer, UserRole } from '../types/kisancred';

interface DashboardOverviewProps {
  farmers: Farmer[];
  records: AgriculturalRecord[];
  credits: CreditApplication[];
  userRole: UserRole;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewFarmerModal: () => void;
  onOpenNewCreditModal: () => void;
  onOpenNewRecordModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  farmers,
  records,
  credits,
  userRole,
  setActiveTab,
  onOpenNewFarmerModal,
  onOpenNewCreditModal,
  onOpenNewRecordModal,
}) => {
  // Aggregate statistics
  const totalLandAcres = farmers.reduce((sum, f) => sum + f.landSizeAcres, 0);
  const totalVerifiedRecords = records.filter((r) => r.status === 'approved').length;
  const pendingRecords = records.filter((r) => r.status === 'pending');
  const totalCreditDisbursed = credits
    .filter((c) => c.status === 'disbursed')
    .reduce((sum, c) => sum + c.amountApproved, 0);
  const totalCreditRequested = credits.reduce((sum, c) => sum + c.amountRequested, 0);
  const totalCropProductionQuintals = records.reduce((sum, r) => sum + r.productionQuantityQuintals, 0);
  const totalGrossCropValuation = records.reduce((sum, r) => sum + r.grossIncome, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Vision Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 shadow-lg border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          {/* Metadata Header - Zero Pill Rule */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-4 tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Agricultural Credit Ecosystem API</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>FastAPI & SQLite Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Where verified crop performance becomes a trusted financial identity.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Enabling farmers to access credit based on what they cultivate, produce, and earn — while maintaining complete control over their agricultural records and transparent financial standing.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenNewCreditModal}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Apply for Seasonal Credit</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewRecordModal}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-300" />
              <span>Log Crop Harvest</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>Underwriting Calculator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Farmers Enrolled</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{farmers.length}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-700">{totalLandAcres.toFixed(1)} acres</span>
            <span>cultivated land</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Crop Yield</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalCropProductionQuintals} <span className="text-sm font-semibold text-slate-500">Quintals</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-700">₹{(totalGrossCropValuation / 100000).toFixed(2)} Lakhs</span>
            <span>gross valuation</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Credit Disbursed</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ₹{(totalCreditDisbursed / 100000).toFixed(2)} <span className="text-sm font-semibold text-slate-500">Lakhs</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-700">4.0% - 5.5%</span>
            <span>priority sector rate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">FPO Verification Rate</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {Math.round((totalVerifiedRecords / Math.max(1, records.length)) * 100)}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-amber-600">{pendingRecords.length} pending review</span>
            <span>by officers</span>
          </div>
        </div>
      </section>

      {/* Target Audiences Architecture Cards (From README specs) */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Multi-Stakeholder Credit Ecosystem
          </h2>
          <p className="text-xs text-slate-500">
            Engineered to align smallholders, local FPOs, and institutional credit providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Primary Users
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Smallholder Farmers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Small and marginal farmers with seasonal agricultural revenue who require affordable credit based on verified harvest yields, rather than predatory collateral or informal loans.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified Identity</span>
              <button
                type="button"
                onClick={() => setActiveTab('farmers')}
                className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Profiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-1">
              Secondary Users
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">FPO Verification Officers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farmer Producer Organization officers who conduct on-field weighment checks, geo-tag parcel coordinates, review APMC receipts, and digitally sign verification records.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{pendingRecords.length} Queued Records</span>
              <button
                type="button"
                onClick={() => setActiveTab('verifications')}
                className="font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Review Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              Tertiary Users
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Banks & Agri Departments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              State agricultural departments, NABARD, and commercial banks deploying priority sector lending with algorithmic risk scoring tied directly to verified crop cycle history.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Automated Underwriting</span>
              <button
                type="button"
                onClick={() => setActiveTab('credits')}
                className="font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Credit Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Section: Pending Verifications & Recent Credit Applications */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Verifications Queue */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Agricultural Verification Queue</h3>
              <p className="text-xs text-slate-500">Harvest logs awaiting FPO officer field verification</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('verifications')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View All ({records.length})
            </button>
          </div>

          <div className="space-y-3">
            {records.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{rec.cropType}</span>
                    <span className="text-[11px] text-slate-500">· {rec.season} {rec.year}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Farmer: <strong className="text-slate-800">{rec.farmerName}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {rec.productionQuantityQuintals} Quintals · ₹{rec.grossIncome.toLocaleString()} gross
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rec.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rec.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{rec.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Credit Pipeline */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Credit Applications Pipeline</h3>
              <p className="text-xs text-slate-500">Loans underwritten by verified crop yield</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('credits')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View Pipeline ({credits.length})
            </button>
          </div>

          <div className="space-y-3">
            {credits.slice(0, 4).map((crd) => (
              <div
                key={crd.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">{crd.purpose}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Applicant: <strong className="text-slate-800">{crd.farmerName}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Requested: ₹{crd.amountRequested.toLocaleString()} · Rate: {crd.interestRate}% p.a.
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      crd.status === 'disbursed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : crd.status === 'approved'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {crd.status.replace(/_/g, ' ')}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{crd.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
