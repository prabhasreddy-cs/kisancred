import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileCheck,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sprout,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AgriculturalRecord, CreditApplication, Farmer } from '../types/kisancred';

interface FarmersViewProps {
  farmers: Farmer[];
  records: AgriculturalRecord[];
  credits: CreditApplication[];
  onAddFarmer: (farmer: Farmer) => void;
  onUpdateFarmer: (farmer: Farmer) => void;
}

export const FarmersView: React.FC<FarmersViewProps> = ({
  farmers,
  records,
  credits,
  onAddFarmer,
  onUpdateFarmer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [landFilter, setLandFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Farmer Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    village: '',
    district: '',
    state: 'Madhya Pradesh',
    landSizeAcres: 3.5,
    farmingExperienceYears: 10,
    creditScore: 720,
    kycVerified: true,
  });

  const states = Array.from(new Set(farmers.map((f) => f.state)));

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (stateFilter !== 'all' && farmer.state !== stateFilter) return false;
    if (landFilter === 'small' && farmer.landSizeAcres >= 2.5) return false;
    if (landFilter === 'medium' && (farmer.landSizeAcres < 2.5 || farmer.landSizeAcres > 5)) return false;
    if (landFilter === 'large' && farmer.landSizeAcres <= 5) return false;

    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out farmer name and phone number.');
      return;
    }

    const newFarmer: Farmer = {
      id: `FMR-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@kisanmail.in`,
      phone: formData.phone,
      address: formData.address || `Gram ${formData.village}`,
      village: formData.village || 'Rampur',
      district: formData.district || 'Indore',
      state: formData.state,
      landSizeAcres: Number(formData.landSizeAcres),
      farmingExperienceYears: Number(formData.farmingExperienceYears),
      creditScore: Number(formData.creditScore),
      kycVerified: formData.kycVerified,
      activeLoanAmount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddFarmer(newFarmer);
    setShowAddModal(false);
    setSelectedFarmer(newFarmer);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      village: '',
      district: '',
      state: 'Madhya Pradesh',
      landSizeAcres: 3.5,
      farmingExperienceYears: 10,
      creditScore: 720,
      kycVerified: true,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Farmer Profile Management
          </h1>
          <p className="text-xs text-slate-500">
            CRUD operations, agricultural track records, land holdings & KYC verification status
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by farmer name, ID, village, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={landFilter}
            onChange={(e) => setLandFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Land Sizes</option>
            <option value="small">Marginal (&lt; 2.5 Acres)</option>
            <option value="medium">Smallholder (2.5 - 5 Acres)</option>
            <option value="large">Medium-Large (&gt; 5 Acres)</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Showing {filteredFarmers.length} of {farmers.length}
          </span>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFarmers.map((farmer) => {
          const farmerRecords = records.filter((r) => r.farmerId === farmer.id);
          const farmerCredits = credits.filter((c) => c.farmerId === farmer.id);

          return (
            <div
              key={farmer.id}
              onClick={() => setSelectedFarmer(farmer)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-[11px] text-slate-400">{farmer.id}</span>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                      {farmer.name}
                    </h3>
                  </div>

                  {farmer.kycVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      <span>KYC Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <span>KYC Pending</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{farmer.village}, {farmer.district}, {farmer.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{farmer.phone}</span>
                  </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{farmer.landSizeAcres} ac</div>
                    <div className="text-[10px] text-slate-400">Land Holding</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{farmerRecords.length}</div>
                    <div className="text-[10px] text-slate-400">Crop Cycles</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-700">{farmer.creditScore}</div>
                    <div className="text-[10px] text-slate-400">Credit Score</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>Active Loans: ₹{farmer.activeLoanAmount.toLocaleString()}</span>
                <span className="text-emerald-700 font-semibold group-hover:underline">View Ledger &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Farmer Detail Drawer / Modal */}
      {selectedFarmer && (
        <div
          onClick={() => setSelectedFarmer(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{selectedFarmer.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>Registered {selectedFarmer.createdAt}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{selectedFarmer.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedFarmer.address}, {selectedFarmer.village}, {selectedFarmer.district}, {selectedFarmer.state}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 text-center text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Land Size</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{selectedFarmer.landSizeAcres} Acres</div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Experience</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{selectedFarmer.farmingExperienceYears} Years</div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Credit Score</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">{selectedFarmer.creditScore}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Active Credit</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">₹{selectedFarmer.activeLoanAmount.toLocaleString()}</div>
              </div>
            </div>

            {/* Agricultural Records for this farmer */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center justify-between">
                <span>Verified Agricultural Records ({records.filter((r) => r.farmerId === selectedFarmer.id).length})</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {records.filter((r) => r.farmerId === selectedFarmer.id).map((r) => (
                  <div key={r.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{r.cropType} ({r.season} {r.year})</div>
                      <div className="text-[11px] text-slate-500">
                        {r.productionQuantityQuintals} Quintals · ₹{r.grossIncome.toLocaleString()} gross income
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
                {records.filter((r) => r.farmerId === selectedFarmer.id).length === 0 && (
                  <p className="text-xs text-slate-400 py-3 text-center">No crop harvest records logged yet.</p>
                )}
              </div>
            </div>

            {/* Credit Applications for this farmer */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">
                Credit Applications ({credits.filter((c) => c.farmerId === selectedFarmer.id).length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {credits.filter((c) => c.farmerId === selectedFarmer.id).map((c) => (
                  <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{c.purpose}</div>
                      <div className="text-[11px] text-slate-500">
                        Requested: ₹{c.amountRequested.toLocaleString()} · Rate: {c.interestRate}%
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
                {credits.filter((c) => c.farmerId === selectedFarmer.id).length === 0 && (
                  <p className="text-xs text-slate-400 py-3 text-center">No active credit applications.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Farmer Modal */}
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
                <h3 className="text-lg font-bold text-slate-900">Enroll New Farmer Profile</h3>
                <p className="text-xs text-slate-500">Creates new digital financial identity on KisanCred</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name of Farmer *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balwinder Singh Gill"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="farmer@kisanmail.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    placeholder="Village / Gram"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    placeholder="District"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Land Holding (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={formData.landSizeAcres}
                    onChange={(e) => setFormData({ ...formData, landSizeAcres: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Farming Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.farmingExperienceYears}
                    onChange={(e) => setFormData({ ...formData, farmingExperienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Credit Score
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="900"
                    value={formData.creditScore}
                    onChange={(e) => setFormData({ ...formData, creditScore: parseInt(e.target.value) || 700 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
