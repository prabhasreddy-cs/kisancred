import React, { useState } from 'react';
import {
  BarChart3,
  Check,
  Copy,
  Download,
  FileCode,
  FileSpreadsheet,
  Filter,
  Search,
} from 'lucide-react';
import { ArchiveAnalysis, CsvDataset, JsonDataset } from '../types';

interface DataExplorerProps {
  analysis: ArchiveAnalysis;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ analysis }) => {
  const [selectedType, setSelectedType] = useState<'csv' | 'json'>(
    analysis.csvDatasets.length > 0 ? 'csv' : 'json'
  );
  const [selectedCsvIdx, setSelectedCsvIdx] = useState(0);
  const [selectedJsonIdx, setSelectedJsonIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  const activeCsv: CsvDataset | undefined = analysis.csvDatasets[selectedCsvIdx];
  const activeJson: JsonDataset | undefined = analysis.jsonDatasets[selectedJsonIdx];

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const filteredCsvRows = activeCsv
    ? activeCsv.rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Datasets & Structured Information
          </h1>
          <p className="text-sm text-slate-500">
            Discovered {analysis.csvDatasets.length} tabular CSV and {analysis.jsonDatasets.length} JSON data source(s)
          </p>
        </div>

        {/* Dataset Type Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start sm:self-auto">
          {analysis.csvDatasets.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedType('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedType === 'csv'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV Datasets ({analysis.csvDatasets.length})</span>
            </button>
          )}

          {analysis.jsonDatasets.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedType('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedType === 'json'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-600" />
              <span>JSON Records ({analysis.jsonDatasets.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* CSV View */}
      {selectedType === 'csv' && activeCsv && (
        <div className="space-y-4">
          {/* Subtabs for Multiple CSVs */}
          {analysis.csvDatasets.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {analysis.csvDatasets.map((ds, idx) => (
                <button
                  key={ds.path}
                  type="button"
                  onClick={() => {
                    setSelectedCsvIdx(idx);
                    setSearchTerm('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCsvIdx === idx
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {ds.name}.csv ({ds.totalRows} rows)
                </button>
              ))}
            </div>
          )}

          {/* Metrics summary for numeric fields */}
          {activeCsv.numericColumns.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeCsv.numericColumns.slice(0, 4).map((col) => {
                const nums = activeCsv.rows.map((r) => Number(r[col])).filter((n) => !isNaN(n));
                const sum = nums.reduce((a, b) => a + b, 0);
                const avg = sum / nums.length;
                return (
                  <div key={col} className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {col}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">
                      {sum >= 1000 ? sum.toLocaleString() : sum.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Avg: {avg.toFixed(1)} · {nums.length} entries
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span>
                  {filteredCsvRows.length} of {activeCsv.totalRows} rows
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{activeCsv.headers.length} columns</span>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
                    {activeCsv.headers.map((h) => (
                      <th key={h} className="py-2.5 px-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredCsvRows.slice(0, 150).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center text-slate-400">{idx + 1}</td>
                      {activeCsv.headers.map((h) => (
                        <td key={h} className="py-2 px-3 text-slate-700 whitespace-nowrap">
                          {row[h] !== undefined && row[h] !== null ? String(row[h]) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* JSON View */}
      {selectedType === 'json' && activeJson && (
        <div className="space-y-4">
          {/* Subtabs for JSON files */}
          {analysis.jsonDatasets.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {analysis.jsonDatasets.map((ds, idx) => (
                <button
                  key={ds.path}
                  type="button"
                  onClick={() => setSelectedJsonIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedJsonIdx === idx
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {ds.name}.json ({ds.itemCount} items)
                </button>
              ))}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs font-mono">{activeJson.path}</span>
                <span className="text-xs text-slate-400 ml-2">
                  ({activeJson.isArray ? `${activeJson.itemCount} records` : 'Object schema'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyJson(activeJson.data)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{JSON.stringify(activeJson.data, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
