import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Database,
  FileCode,
  FolderTree,
  Key,
  Layers,
  Lock,
  Server,
  Terminal,
} from 'lucide-react';
import { systemEnvironment } from '../data/initialData';

export const ArchitectureView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyEnv = () => {
    const envString = `SECRET_KEY=dev_secret_key_kisancred_123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./agricultural_credit.db
DEBUG=True
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:8000"]
HOST=0.0.0.0
PORT=8000`;
    navigator.clipboard.writeText(envString);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>Technical Architecture & Database Schema</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          KisanCred System Specification & Deployment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Modular Monolith architecture with FastAPI, SQLAlchemy ORM, and Pydantic validation
        </p>
      </div>

      {/* Environment Config Cards */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Lock className="w-5 h-5 text-emerald-700" />
            <span>Extracted Environment Configuration (.env)</span>
          </div>

          <button
            type="button"
            onClick={handleCopyEnv}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied .env' : 'Copy Variables'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">Database Engine</div>
            <div className="font-mono font-bold text-slate-900 text-xs mt-1 truncate">
              {systemEnvironment.DATABASE_URL}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">SQLite (dev) / PostgreSQL</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">Auth Algorithm</div>
            <div className="font-mono font-bold text-slate-900 text-xs mt-1">
              {systemEnvironment.ALGORITHM} (JWT)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Expires in 30 mins</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">Host & Port</div>
            <div className="font-mono font-bold text-slate-900 text-xs mt-1">
              {systemEnvironment.HOST}:{systemEnvironment.PORT}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">FastAPI ASGI Uvicorn</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">CORS Allowed Origins</div>
            <div className="font-mono font-bold text-slate-900 text-xs mt-1 truncate">
              localhost:3000, 5173, 8000
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Full frontend integration</div>
          </div>
        </div>

        <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
          <code>{`SECRET_KEY=dev_secret_key_kisancred_123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./agricultural_credit.db
DEBUG=True
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:8000"]
HOST=0.0.0.0
PORT=8000`}</code>
        </pre>
      </div>

      {/* Database Models & Relationships */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-4 border-b border-slate-100 mb-6">
          <Database className="w-5 h-5 text-emerald-700" />
          <span>SQLAlchemy Database Schema Models</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farmer Model */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-slate-900 text-sm">class Farmer(Base)</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Primary Model
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Stores farmer identity, geo-location, contact details, and land holdings in acres.
            </p>
            <ul className="text-xs font-mono space-y-1 text-slate-700">
              <li><span className="text-emerald-700">id</span>: String (UUID/Slug) [PK]</li>
              <li><span className="text-emerald-700">name</span>: String, nullable=False</li>
              <li><span className="text-emerald-700">email</span>: String, unique=True</li>
              <li><span className="text-emerald-700">phone</span>: String, nullable=False</li>
              <li><span className="text-emerald-700">address</span>: Text</li>
              <li><span className="text-emerald-700">land_size_acres</span>: Float</li>
              <li><span className="text-slate-400">agricultural_records</span>: relationship("AgriculturalRecord")</li>
              <li><span className="text-slate-400">credit_applications</span>: relationship("CreditApplication")</li>
            </ul>
          </div>

          {/* AgriculturalRecord Model */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-slate-900 text-sm">class AgriculturalRecord(Base)</span>
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                Verification Ledger
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Seasonal harvest logs verified by FPO officers to establish trustworthy financial credit scores.
            </p>
            <ul className="text-xs font-mono space-y-1 text-slate-700">
              <li><span className="text-sky-700">id</span>: String [PK]</li>
              <li><span className="text-sky-700">farmer_id</span>: ForeignKey("farmers.id")</li>
              <li><span className="text-sky-700">crop_type</span>: String (e.g. Wheat, Basmati Rice)</li>
              <li><span className="text-sky-700">season</span>: Enum("Kharif", "Rabi", "Zaid")</li>
              <li><span className="text-sky-700">production_quantity</span>: Float (Quintals)</li>
              <li><span className="text-sky-700">gross_income</span>: Float (INR/USD)</li>
              <li><span className="text-sky-700">status</span>: Enum("pending", "approved", "rejected")</li>
              <li><span className="text-sky-700">verified_by</span>: ForeignKey("users.id")</li>
            </ul>
          </div>

          {/* CreditApplication Model */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-slate-900 text-sm">class CreditApplication(Base)</span>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                Underwriting
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Priority sector loans underwritten with automated risk ratings derived from verified harvest yields.
            </p>
            <ul className="text-xs font-mono space-y-1 text-slate-700">
              <li><span className="text-indigo-700">id</span>: String [PK]</li>
              <li><span className="text-indigo-700">farmer_id</span>: ForeignKey("farmers.id")</li>
              <li><span className="text-indigo-700">amount_requested</span>: Float</li>
              <li><span className="text-indigo-700">amount_approved</span>: Float</li>
              <li><span className="text-indigo-700">purpose</span>: String (Drip Irrigation, Seeds, Solar)</li>
              <li><span className="text-indigo-700">interest_rate</span>: Float (4.0% - 5.5% Subsidized)</li>
              <li><span className="text-indigo-700">status</span>: Enum("underwriting", "approved", "disbursed")</li>
              <li><span className="text-indigo-700">due_date</span>: DateTime</li>
            </ul>
          </div>

          {/* User & FPO Model */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-slate-900 text-sm">class User(Base)</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                RBAC & FPO
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Role-based authentication for FPO field officers, merchant partners, and lending underwriters.
            </p>
            <ul className="text-xs font-mono space-y-1 text-slate-700">
              <li><span className="text-amber-700">id</span>: String [PK]</li>
              <li><span className="text-amber-700">email</span>: String, unique=True</li>
              <li><span className="text-amber-700">hashed_password</span>: String</li>
              <li><span className="text-amber-700">role</span>: Enum("fpo_officer", "merchant", "bank_lender", "admin")</li>
              <li><span className="text-amber-700">is_active</span>: Boolean, default=True</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Project Structure from README */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-4 border-b border-slate-100 mb-6">
          <FolderTree className="w-5 h-5 text-emerald-700" />
          <span>Extracted Project Structure</span>
        </div>

        <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
          <code>{`kisancred/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management & environment reading
│   ├── database.py          # SQLAlchemy engine & SessionLocal provider
│   ├── models.py            # SQLAlchemy database models (Farmer, Record, Credit, User)
│   ├── schemas.py           # Pydantic schemas for request/response validation
│   ├── requirements.txt     # Python dependencies (fastapi, uvicorn, sqlalchemy, pydantic)
│   └── routers/
│       ├── __init__.py
│       ├── farmers.py       # Farmer CRUD endpoints
│       ├── credits.py       # Credit application endpoints
│       └── verifications.py # Agricultural record & verification endpoints
├── frontend/                # React & Tailwind client application
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore patterns
└── README.md                # Agricultural Credit Ecosystem specification`}</code>
        </pre>
      </div>
    </div>
  );
};
