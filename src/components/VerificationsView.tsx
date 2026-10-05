import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  FileCheck,
  FilePlus,
  Filter,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sprout,
  X,
  XCircle,
} from 'lucide-react';
import { AgriculturalRecord, CropSeason, Farmer, UserRole } from '../types/kisancred';

interface VerificationsViewProps {
  records: AgriculturalRecord[];
  farmers: Farmer[];
  userRole: UserRole;
  onVerifyRecord: (recordId: string, status: 'approved' | 'rejected', notes: string, officerName: string) => void;
  onAddRecord: (record: AgriculturalRecord) => void;
}

export const VerificationsView: React.FC<VerificationsViewProps> = ({
  records,
  farmers,
  userRole,
  onVerifyRecord,
  onAddRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [seasonFilter, setSeasonFilter] = useState<'all' | 'Kharif' | 'Rabi' | 'Zaid'>('all');

  // Verify modal state
  const [selectedRecordToVerify, setSelectedRecordToVerify] = useState<AgriculturalRecord | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [officerName, setOfficerName] = useState('Dr. Vivek Sharma (FPO-Central-08)');

  // Add Record Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecordForm, setNewRecordForm] = useState({
    farmerId: farmers[0]?.id || '',
    cropType: 'Wheat (Sharbati HD-2967)',
    season: 'Rabi' as CropSeason,
    year: 2026,
    productionQuantityQuintals: 60,
    grossIncome: 280000,
    geoCoordinates: '24.1205° N, 75.2910° E',
    soilHealthIndex: 'Optimal (pH 7.2)',
  });

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (seasonFilter !== 'all' && r.season !== seasonFilter) return false;
    return true;
  });

  const handleVerifySubmit = (status: 'approved' | 'rejected') => {
    if (!selectedRecordToVerify) return;
    onVerifyRecord(selectedRecordToVerify.id, status, officerNotes, officerName);
    setSelectedRecordToVerify(null);
    setOfficerNotes('');
  };

  const handleCreateRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = farmers.find((f) => f.id === newRecordForm.farmerId);
    if (!farmer) return;

    const newRecord: AgriculturalRecord = {
      id: `REC-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      farmerId: farmer.id,
      farmerName: farmer.name,
      cropType: newRecordForm.cropType,
      season: newRecordForm.season,
      year: Number(newRecordForm.year),
      productionQuantityQuintals: Number(newRecordForm.productionQuantityQuintals),
      grossIncome: Number(newRecordForm.grossIncome),
      status: 'pending',
      verificationNotes: 'Newly logged harvest record awaiting on-field FPO verification.',
      geoCoordinates: newRecordForm.geoCoordinates,
      soilHealthIndex: newRecordForm.soilHealthIndex,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddRecord(newRecord);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Agricultural Performance & Verification System
          </h1>
          <p className="text-xs text-slate-500">
            Track seasonal crop yield, income logs, and FPO field verification audit trails
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          <span>Log Crop Harvest</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search crop, farmer name, or record ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status segmented buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Pending ({records.filter((r) => r.status === 'pending').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('approved')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'approved' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Verified ({records.filter((r) => r.status === 'approved').length})
            </button>
          </div>

          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Seasons</option>
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Zaid">Zaid (Summer)</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Record ID / Date</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Crop & Variety</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4">Production Yield</th>
                <th className="py-3 px-4">Gross Income</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-semibold text-slate-900">{rec.id}</div>
                    <div className="text-[11px] text-slate-400">{rec.createdAt}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{rec.farmerName}</div>
                    <div className="font-mono text-[11px] text-slate-400">{rec.farmerId}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{rec.cropType}</div>
                    {rec.geoCoordinates && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rec.geoCoordinates}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700">{rec.season}</span>
                    <span className="text-slate-400 ml-1 font-mono">{rec.year}</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-900">{rec.productionQuantityQuintals}</span>{' '}
                    <span className="text-slate-500 text-[11px]">Quintals</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-emerald-800">₹{rec.grossIncome.toLocaleString()}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.status === 'approved' ? '✓ Verified' : rec.status}
                    </span>
                    {rec.verifiedByOfficer && (
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5" title={rec.verifiedByOfficer}>
                        {rec.verifiedByOfficer}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {rec.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedRecordToVerify(rec)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>FPO Verify</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedRecordToVerify(rec)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Audit Log</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No agricultural records match the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FPO Officer Verification Modal */}
      {selectedRecordToVerify && (
        <div
          onClick={() => setSelectedRecordToVerify(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  FPO Harvest Verification Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Record ID: {selectedRecordToVerify.id} · Farmer: {selectedRecordToVerify.farmerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecordToVerify(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Record details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Crop & Variety:</span>
                <span className="font-bold text-slate-900">{selectedRecordToVerify.cropType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Harvest Yield:</span>
                <span className="font-bold text-slate-900">{selectedRecordToVerify.productionQuantityQuintals} Quintals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Sale Income:</span>
                <span className="font-bold text-emerald-700 font-mono">₹{selectedRecordToVerify.grossIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parcel Geo-Coordinates:</span>
                <span className="font-mono text-slate-700">{selectedRecordToVerify.geoCoordinates || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Soil Health:</span>
                <span className="text-slate-700">{selectedRecordToVerify.soilHealthIndex || 'Optimal'}</span>
              </div>
            </div>

            {/* Verification Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verifying FPO Officer Signature / ID
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  On-Field Audit & Mandi Weighment Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record grain moisture tests, APMC receipt verification, and physical inspection notes..."
                  value={officerNotes || selectedRecordToVerify.verificationNotes || ''}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedRecordToVerify(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleVerifySubmit('rejected')}
                  className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  Reject Record
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifySubmit('approved')}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Digitally Verify & Certify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Crop Harvest Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Log Seasonal Crop Production</h3>
                <p className="text-xs text-slate-500">Record agricultural harvest to enhance credit limit</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Farmer *
                </label>
                <select
                  value={newRecordForm.farmerId}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, farmerId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.id}) - {f.village}, {f.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crop Type & Variety *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basmati Rice (Pusa 1121) or Wheat (Sharbati)"
                  value={newRecordForm.cropType}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, cropType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Season</label>
                  <select
                    value={newRecordForm.season}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, season: e.target.value as CropSeason })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Year</label>
                  <input
                    type="number"
                    value={newRecordForm.year}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Production Quantity (Quintals) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newRecordForm.productionQuantityQuintals}
                    onChange={(e) => {
                      const qty = parseFloat(e.target.value) || 0;
                      // estimate ~4500 per quintal
                      setNewRecordForm({
                        ...newRecordForm,
                        productionQuantityQuintals: qty,
                        grossIncome: Math.round(qty * 4500),
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gross Income (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={newRecordForm.grossIncome}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, grossIncome: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parcel Coordinates (GPS)
                  </label>
                  <input
                    type="text"
                    value={newRecordForm.geoCoordinates}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, geoCoordinates: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Soil Health Status
                  </label>
                  <input
                    type="text"
                    value={newRecordForm.soilHealthIndex}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, soilHealthIndex: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-xs cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
