/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { FarmersView } from './components/FarmersView';
import { VerificationsView } from './components/VerificationsView';
import { CreditsView } from './components/CreditsView';
import { CreditCalculator } from './components/CreditCalculator';
import { ApiSandbox } from './components/ApiSandbox';
import { ArchitectureView } from './components/ArchitectureView';
import {
  initialAgriculturalRecords,
  initialCreditApplications,
  initialFarmers,
} from './data/initialData';
import {
  ActiveTab,
  AgriculturalRecord,
  CreditApplication,
  CreditStatus,
  Farmer,
  UserRole,
} from './types/kisancred';
import { CheckCircle2, ShieldCheck, Sprout, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [userRole, setUserRole] = useState<UserRole>('fpo_officer');

  // Application Data States
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [records, setRecords] = useState<AgriculturalRecord[]>(initialAgriculturalRecords);
  const [credits, setCredits] = useState<CreditApplication[]>(initialCreditApplications);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Farmer CRUD
  const handleAddFarmer = (farmer: Farmer) => {
    setFarmers((prev) => [farmer, ...prev]);
    showToast(`Farmer profile for "${farmer.name}" registered successfully.`);
  };

  const handleUpdateFarmer = (updated: Farmer) => {
    setFarmers((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    showToast(`Updated farmer profile for ${updated.name}.`);
  };

  // Agricultural Records & FPO Verification
  const handleVerifyRecord = (
    recordId: string,
    status: 'approved' | 'rejected',
    notes: string,
    officerName: string
  ) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status,
              verificationNotes: notes || r.verificationNotes,
              verifiedByOfficer: officerName,
              verificationDate: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );

    const record = records.find((r) => r.id === recordId);
    if (status === 'approved') {
      showToast(`Record ${recordId} (${record?.cropType}) digitally verified and certified.`);
    } else {
      showToast(`Record ${recordId} was marked as rejected by FPO officer.`);
    }
  };

  const handleAddRecord = (record: AgriculturalRecord) => {
    setRecords((prev) => [record, ...prev]);
    showToast(`New crop production record logged for ${record.farmerName}. Queued for FPO verification.`);
  };

  // Credit Applications
  const handleUpdateCreditStatus = (creditId: string, newStatus: CreditStatus) => {
    setCredits((prev) =>
      prev.map((c) => {
        if (c.id === creditId) {
          return {
            ...c,
            status: newStatus,
            disbursementDate:
              newStatus === 'disbursed'
                ? new Date().toISOString().split('T')[0]
                : c.disbursementDate,
          };
        }
        return c;
      })
    );

    if (newStatus === 'approved') {
      showToast(`Credit Application ${creditId} successfully approved.`);
    } else if (newStatus === 'disbursed') {
      showToast(`Funds disbursed for application ${creditId}. Transferred to farmer bank account.`);
    } else if (newStatus === 'repaid') {
      showToast(`Loan ${creditId} successfully closed and marked as fully repaid.`);
    }
  };

  const handleAddCreditApplication = (application: CreditApplication) => {
    setCredits((prev) => [application, ...prev]);
    showToast(`Credit application submitted for ${application.farmerName} (₹${application.amountRequested.toLocaleString()}).`);
  };

  const handleApplyCalculatedLimit = (amount: number, purpose: string) => {
    setActiveTab('credits');
    showToast(`Navigated to Credit Applications with pre-approved limit of ₹${amount.toLocaleString()}.`);
  };

  const pendingVerificationsCount = records.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        pendingVerificationsCount={pendingVerificationsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            farmers={farmers}
            records={records}
            credits={credits}
            userRole={userRole}
            setActiveTab={setActiveTab}
            onOpenNewFarmerModal={() => setActiveTab('farmers')}
            onOpenNewCreditModal={() => setActiveTab('credits')}
            onOpenNewRecordModal={() => setActiveTab('verifications')}
          />
        )}

        {activeTab === 'farmers' && (
          <FarmersView
            farmers={farmers}
            records={records}
            credits={credits}
            onAddFarmer={handleAddFarmer}
            onUpdateFarmer={handleUpdateFarmer}
          />
        )}

        {activeTab === 'verifications' && (
          <VerificationsView
            records={records}
            farmers={farmers}
            userRole={userRole}
            onVerifyRecord={handleVerifyRecord}
            onAddRecord={handleAddRecord}
          />
        )}

        {activeTab === 'credits' && (
          <CreditsView
            credits={credits}
            farmers={farmers}
            records={records}
            userRole={userRole}
            onUpdateCreditStatus={handleUpdateCreditStatus}
            onAddCreditApplication={handleAddCreditApplication}
          />
        )}

        {activeTab === 'calculator' && (
          <CreditCalculator onApplyCalculatedLimit={handleApplyCalculatedLimit} />
        )}

        {activeTab === 'api_docs' && (
          <ApiSandbox farmers={farmers} records={records} credits={credits} />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900">KisanCred</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Agricultural Credit Ecosystem</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI & SQLite Runtime</span>
            <span aria-hidden="true">·</span>
            <span>FPO Quorum Protocol</span>
            <span aria-hidden="true">·</span>
            <span>Priority Sector Lending</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
