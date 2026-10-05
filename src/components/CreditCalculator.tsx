import React, { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Coins,
  Percent,
  PiggyBank,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
} from 'lucide-react';

interface CreditCalculatorProps {
  onApplyCalculatedLimit: (amount: number, purpose: string) => void;
}

const CROP_PRESETS: Record<string, { avgYieldPerAcre: number; defaultPricePerQuintal: number; season: string }> = {
  'Wheat (Sharbati / HD-2967)': { avgYieldPerAcre: 22, defaultPricePerQuintal: 2450, season: 'Rabi' },
  'Basmati Rice (Pusa 1121)': { avgYieldPerAcre: 24, defaultPricePerQuintal: 4200, season: 'Kharif' },
  'Soybean (JS-9560)': { avgYieldPerAcre: 16, defaultPricePerQuintal: 4600, season: 'Kharif' },
  'Cotton (Bt Hybrid)': { avgYieldPerAcre: 14, defaultPricePerQuintal: 6800, season: 'Kharif' },
  'Sugarcane (Co 86032)': { avgYieldPerAcre: 350, defaultPricePerQuintal: 380, season: 'Kharif' },
  'Mustard (Pusa Bold)': { avgYieldPerAcre: 12, defaultPricePerQuintal: 5400, season: 'Rabi' },
  'Red Chilli (Teja Variety)': { avgYieldPerAcre: 18, defaultPricePerQuintal: 11000, season: 'Kharif' },
  'Gram / Chana': { avgYieldPerAcre: 11, defaultPricePerQuintal: 5800, season: 'Rabi' },
};

export const CreditCalculator: React.FC<CreditCalculatorProps> = ({
  onApplyCalculatedLimit,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat (Sharbati / HD-2967)');
  const [landAcres, setLandAcres] = useState<number>(3.5);
  const [yieldPerAcre, setYieldPerAcre] = useState<number>(22);
  const [pricePerQuintal, setPricePerQuintal] = useState<number>(2450);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [hasFpoVerification, setHasFpoVerification] = useState<boolean>(true);

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    const preset = CROP_PRESETS[crop];
    if (preset) {
      setYieldPerAcre(preset.avgYieldPerAcre);
      setPricePerQuintal(preset.defaultPricePerQuintal);
    }
  };

  // Calculations
  const totalProductionQuintals = Math.round(landAcres * yieldPerAcre);
  const grossCropValuation = Math.round(totalProductionQuintals * pricePerQuintal);

  // LTV (Loan-To-Value) ratio: 65% for FPO verified, 50% for unverified
  const ltvMultiplier = hasFpoVerification ? 0.65 : 0.50;
  const eligibleCreditLimit = Math.round(grossCropValuation * ltvMultiplier);

  // Subsidized interest rate: 4.0% for verified smallholder vs 12-18% unorganized
  const interestRate = hasFpoVerification ? 4.0 : 7.5;
  const interestAmount = Math.round((eligibleCreditLimit * (interestRate / 100) * (tenureMonths / 12)));
  const totalRepayable = eligibleCreditLimit + interestAmount;

  // Potential savings vs traditional unorganized money lender (typically 24% annual rate)
  const informalLenderInterest = Math.round((eligibleCreditLimit * 0.24 * (tenureMonths / 12)));
  const interestSaved = informalLenderInterest - interestAmount;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md mb-2 border border-emerald-100">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>KisanCred Underwriting Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Yield-to-Credit Underwriting Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compute instant collateral-free credit eligibility and priority sector interest subsidies based on verified crop performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Cultivation & Parcel Parameters</span>
          </div>

          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Cultivated Crop & Variety
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
            >
              {Object.keys(CROP_PRESETS).map((crop) => (
                <option key={crop} value={crop}>
                  {crop} ({CROP_PRESETS[crop].season} Season)
                </option>
              ))}
            </select>
          </div>

          {/* Land size slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Land Holding Parcel Size</label>
              <span className="font-bold text-emerald-700 font-mono text-sm">{landAcres} Acres</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={landAcres}
              onChange={(e) => setLandAcres(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.5 Acres (Marginal)</span>
              <span>5.0 Acres (Small)</span>
              <span>20 Acres (Medium-Large)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Yield / Acre (Quintals)
              </label>
              <input
                type="number"
                min="1"
                value={yieldPerAcre}
                onChange={(e) => setYieldPerAcre(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Mandi Price (₹ / Quintal)
              </label>
              <input
                type="number"
                step="50"
                min="100"
                value={pricePerQuintal}
                onChange={(e) => setPricePerQuintal(parseFloat(e.target.value) || 100)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Repayment Tenure
              </label>
              <select
                value={tenureMonths}
                onChange={(e) => setTenureMonths(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                <option value={6}>6 Months (Single Harvest Cycle)</option>
                <option value={12}>12 Months (Annual Kharif + Rabi)</option>
                <option value={24}>24 Months (Irrigation Equipment)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                FPO Verification Level
              </label>
              <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={hasFpoVerification}
                  onChange={(e) => setHasFpoVerification(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Verified by FPO Officer (+15% LTV, 4% rate)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className="lg:col-span-5 bg-linear-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/50 space-y-6">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold uppercase tracking-wider">
            <span>Algorithmic Valuation</span>
            <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-[10px] text-emerald-200">
              {hasFpoVerification ? 'Tier-1 Priority Credit' : 'Standard Tier'}
            </span>
          </div>

          <div>
            <div className="text-xs text-emerald-200 font-medium">Eligible Collateral-Free Credit Ceiling</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-mono">
              ₹{eligibleCreditLimit.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-300/80 mt-1">
              Based on {ltvMultiplier * 100}% Loan-To-Value of verified harvest
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-emerald-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-200/80">Est. Total Harvest:</span>
              <span className="font-bold text-white">{totalProductionQuintals} Quintals</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/80">Gross Crop Revenue Value:</span>
              <span className="font-bold text-white font-mono">₹{grossCropValuation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/80">Subsidized Interest Rate:</span>
              <span className="font-bold text-emerald-300 font-mono">{interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/80">Interest Over {tenureMonths} Mo:</span>
              <span className="font-bold text-white font-mono">₹{interestAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/80">Total Repayable Post-Harvest:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                ₹{totalRepayable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Money Saved Banner */}
          <div className="p-3.5 bg-emerald-800/40 rounded-2xl border border-emerald-600/40 flex items-start gap-3">
            <PiggyBank className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-200">
                ₹{interestSaved.toLocaleString()} Saved in Financing Costs
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                Compared to predatory informal local credit (24% APR) thanks to KisanCred verified identity.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onApplyCalculatedLimit(eligibleCreditLimit, `Cultivation credit for ${selectedCrop} (${landAcres} acres)`)}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed with ₹{eligibleCreditLimit.toLocaleString()} Pre-Approved Limit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
