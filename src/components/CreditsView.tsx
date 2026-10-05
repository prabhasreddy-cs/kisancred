import React, { useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  Landmark,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { AgriculturalRecord, CreditApplication, CreditStatus, Farmer, UserRole } from '../types/kisancred';

interface CreditsViewProps {
  credits: CreditApplication[];
  farmers: Farmer[];
  records: AgriculturalRecord[];
  userRole: UserRole;
  onUpdateCreditStatus: (creditId: string, newStatus: CreditStatus) => void;
  onAddCreditApplication: (application: CreditApplication) => void;
}

export const CreditsView: React.FC<CreditsViewProps> = ({
  credits,
  farmers,
  records,
  userRole,
  onUpdateCreditStatus,
  onAddCreditApplication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCredit, setSelectedCredit] = useState<CreditApplication | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // New Credit Application Form
  const [applyForm, setApplyForm] = useState({
    farmerId: farmers[0]?.id || '',
    amountRequested: 150000,
    purpose: 'Precision Micro-Irrigation & Certified Seed Inputs',
    repaymentTermsMonths: 12,
    repaymentStructure: 'bullet_post_harvest' as CreditApplication['repaymentStructure'],
    interestRate: 4.0,
  });

  const selectedFarmer = farmers.find((f) => f.id === applyForm.farmerId);
  const selectedFarmerRecords = records.filter(
    (r) => r.farmerId === applyForm.farmerId && r.status === 'approved'
  );
  const verifiedYieldValue = selectedFarmerRecords.reduce((sum, r) => sum + r.grossIncome, 0);
  const eligibleCreditCeiling = Math.round(verifiedYieldValue * 0.65);

  const filteredCredits = credits.filter((c) => {
    const matchesSearch =
      c.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer) return;

    const newApp: CreditApplication = {
      id: `CRD-2026-${String(Math.floor(810 + Math.random() * 180))}`,
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      amountRequested: Number(applyForm.amountRequested),
      amountApproved: Number(applyForm.amountRequested), // pre-approved estimate
      purpose: applyForm.purpose,
      status: 'under_underwriting',
      interestRate: applyForm.interestRate,
      repaymentTermsMonths: Number(applyForm.repaymentTermsMonths),
      repaymentStructure: applyForm.repaymentStructure,
      verifiedYieldValuation: verifiedYieldValue || 350000,
      appliedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + applyForm.repaymentTermsMonths * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      notes: `Underwritten against ₹${(verifiedYieldValue || 350000).toLocaleString()} verified harvest history. Subsidized interest rate applied.`,
    };

    onAddCreditApplication(newApp);
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Agricultural Credit & Lending Operations
          </h1>
          <p className="text-xs text-slate-500">
            Collateral-free priority credit underwritten against verified crop harvest history
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Coins className="w-4 h-4" />
          <span>New Credit Application</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by loan purpose, farmer name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Application Statuses ({credits.length})</option>
            <option value="pending_fpo_verification">Pending FPO Verification</option>
            <option value="under_underwriting">Under Underwriting</option>
            <option value="approved">Approved</option>
            <option value="disbursed">Disbursed (Active)</option>
            <option value="repaid">Repaid</option>
          </select>
        </div>
      </div>

      {/* Credit Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Amount Requested / Approved</th>
                <th className="py-3 px-4">Interest Rate</th>
                <th className="py-3 px-4">Repayment Terms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCredits.map((crd) => (
                <tr key={crd.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-semibold text-slate-900">{crd.id}</div>
                    <div className="text-[11px] text-slate-400">{crd.appliedDate}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{crd.farmerName}</div>
                    <div className="font-mono text-[11px] text-slate-400">{crd.farmerId}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 max-w-xs">{crd.purpose}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Backing Yield: ₹{crd.verifiedYieldValuation.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-900">₹{crd.amountRequested.toLocaleString()}</div>
                    {crd.amountApproved > 0 && (
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        Approved: ₹{crd.amountApproved.toLocaleString()}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                    {crd.interestRate}% <span className="text-[10px] text-slate-400 font-normal">p.a.</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-700">{crd.repaymentTermsMonths} Months</div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {crd.repaymentStructure.replace(/_/g, ' ')}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        crd.status === 'disbursed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : crd.status === 'approved'
                          ? 'bg-sky-100 text-sky-800'
                          : crd.status === 'under_underwriting'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {crd.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {crd.status === 'under_underwriting' && (
                        <button
                          type="button"
                          onClick={() => onUpdateCreditStatus(crd.id, 'approved')}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {crd.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => onUpdateCreditStatus(crd.id, 'disbursed')}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                        >
                          Disburse Funds
                        </button>
                      )}

                      {crd.status === 'disbursed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateCreditStatus(crd.id, 'repaid')}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Close / Repaid
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedCredit(crd)}
                        className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCredits.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No credit applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Details Modal */}
      {selectedCredit && (
        <div
          onClick={() => setSelectedCredit(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Credit Agreement & Underwriting Summary</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCredit.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCredit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900">{selectedCredit.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="font-bold text-slate-900">{selectedCredit.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Requested:</span>
                  <span className="font-bold text-slate-900 font-mono">₹{selectedCredit.amountRequested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Approved:</span>
                  <span className="font-bold text-emerald-700 font-mono">₹{selectedCredit.amountApproved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Interest Rate:</span>
                  <span className="font-bold text-slate-900">{selectedCredit.interestRate}% Priority Lending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Repayment Period:</span>
                  <span className="font-bold text-slate-900">{selectedCredit.repaymentTermsMonths} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold uppercase text-emerald-800">{selectedCredit.status}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="font-semibold text-emerald-900 text-xs mb-1">Underwriter Verification Note</div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedCredit.notes || 'This loan is underwritten with verified agricultural data per KisanCred digital identity standards.'}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 flex items-center justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCredit(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Credit Application Modal */}
      {showApplyModal && (
        <div
          onClick={() => setShowApplyModal(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Credit Application</h3>
                <p className="text-xs text-slate-500">Instant credit evaluation backed by verified crop records</p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Enrolled Farmer *
                </label>
                <select
                  value={applyForm.farmerId}
                  onChange={(e) => setApplyForm({ ...applyForm, farmerId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.landSizeAcres} Acres) - {f.village}, {f.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Algorithmic Credit Limit Box */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-emerald-900">Verified Crop Value Backing:</span>
                  <span className="font-bold text-emerald-800 font-mono">₹{verifiedYieldValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-900">Pre-Approved Credit Ceiling (65% LTV):</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-sm">
                    ₹{eligibleCreditCeiling.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credit Purpose *
                </label>
                <select
                  value={applyForm.purpose}
                  onChange={(e) => setApplyForm({ ...applyForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Precision Micro-Irrigation & Certified Seed Inputs">
                    Precision Micro-Irrigation & Certified Seed Inputs
                  </option>
                  <option value="Solar Water Pump Subvention Installation">
                    Solar Water Pump Subvention Installation
                  </option>
                  <option value="High-Yield Hybrid Seeds & Organic Fertilizers">
                    High-Yield Hybrid Seeds & Organic Fertilizers
                  </option>
                  <option value="Post-Harvest Warehouse & Cold Storage Receipt Financing">
                    Post-Harvest Warehouse & Cold Storage Receipt Financing
                  </option>
                  <option value="Mechanized Harvester & Laser Leveller Rental">
                    Mechanized Harvester & Laser Leveller Rental
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Requested (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="10000"
                    max={eligibleCreditCeiling > 50000 ? eligibleCreditCeiling * 1.2 : 500000}
                    value={applyForm.amountRequested}
                    onChange={(e) => setApplyForm({ ...applyForm, amountRequested: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subsidized Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={applyForm.interestRate}
                    onChange={(e) => setApplyForm({ ...applyForm, interestRate: parseFloat(e.target.value) || 4.0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Repayment Tenure
                  </label>
                  <select
                    value={applyForm.repaymentTermsMonths}
                    onChange={(e) => setApplyForm({ ...applyForm, repaymentTermsMonths: parseInt(e.target.value) || 12 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value={6}>6 Months (Single Crop Cycle)</option>
                    <option value={12}>12 Months (Kharif + Rabi)</option>
                    <option value={24}>24 Months (Capital Equipment)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Repayment Structure
                  </label>
                  <select
                    value={applyForm.repaymentStructure}
                    onChange={(e) => setApplyForm({ ...applyForm, repaymentStructure: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="bullet_post_harvest">Bullet Post-Harvest (Lump Sum)</option>
                    <option value="monthly_installments">Monthly Equated Installments</option>
                    <option value="seasonal_tranches">Seasonal Tranches</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
