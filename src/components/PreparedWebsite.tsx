import React, { useState } from 'react';
import {
  Archive,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  FolderTree,
  ImageIcon,
  Maximize2,
  Search,
  Sparkles,
  Table,
} from 'lucide-react';
import { marked } from 'marked';
import { ArchiveAnalysis, ExtractedFile, SiteThemeConfig } from '../types';

interface PreparedWebsiteProps {
  analysis: ArchiveAnalysis;
  theme: SiteThemeConfig;
  onSelectTab: (tab: any) => void;
  onInspectFile: (file: ExtractedFile) => void;
}

export const PreparedWebsite: React.FC<PreparedWebsiteProps> = ({
  analysis,
  theme,
  onSelectTab,
  onInspectFile,
}) => {
  // Documentation reader state
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Data table state
  const [selectedCsvIndex, setSelectedCsvIndex] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Gallery state
  const [activeLightboxImg, setActiveLightboxImg] = useState<ExtractedFile | null>(null);

  const activeDoc = analysis.markdownDocs[selectedDocIndex];
  const activeCsv = analysis.csvDatasets[selectedCsvIndex];

  const handleCopyDoc = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  // Filter and sort CSV rows
  const getProcessedRows = () => {
    if (!activeCsv) return [];
    let rows = [...activeCsv.rows];
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    if (sortCol) {
      rows.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }
    return rows;
  };

  const processedRows = getProcessedRows();

  // Calculate quick stats for numeric columns
  const getColumnStats = (col: string) => {
    if (!activeCsv) return null;
    const nums = activeCsv.rows
      .map((r) => Number(r[col]))
      .filter((n) => !isNaN(n));
    if (nums.length === 0) return null;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / nums.length;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return { sum, avg, min, max };
  };

  // Total records across all datasets
  const totalRecords =
    analysis.csvDatasets.reduce((sum, d) => sum + d.totalRows, 0) +
    analysis.jsonDatasets.reduce((sum, j) => sum + j.itemCount, 0);

  const primaryTitle = theme.customTitle || analysis.primaryTitle;
  const subtitle =
    theme.customSubtitle ||
    analysis.summaryDescription ||
    'Extracted and transformed into an interactive site.';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Hero Section */}
      {theme.showHero && (
        <section className="relative bg-white border-b border-slate-200 overflow-hidden pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Quiet Text Metadata - Zero-pill discipline */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                <span className="font-semibold text-sky-700 uppercase tracking-wider">
                  {analysis.detectedType.replace('-', ' ')}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{analysis.archiveName}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{analysis.totalFiles} files unpacked</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{analysis.formattedTotalSize}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {primaryTitle}
              </h1>

              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                {subtitle}
              </p>

              {/* Quick Jump Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                {analysis.hasIndexHtml && (
                  <button
                    type="button"
                    onClick={() => onSelectTab('live-preview')}
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Launch Live Preview</span>
                  </button>
                )}

                {analysis.csvDatasets.length > 0 && (
                  <a
                    href="#data-section"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-xs"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Explore Data ({analysis.csvDatasets.length} tables)</span>
                  </a>
                )}

                {analysis.markdownDocs.length > 0 && (
                  <a
                    href="#docs-section"
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Read Docs ({analysis.markdownDocs.length} articles)</span>
                  </a>
                )}

                {analysis.images.length > 0 && (
                  <a
                    href="#gallery-section"
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span>View Gallery ({analysis.images.length} assets)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Metrics Strip */}
      {theme.showMetrics && (
        <section className="bg-slate-100/70 border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{analysis.totalFiles}</div>
                <div className="text-xs text-slate-500 mt-1">Total Files Extracted</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{analysis.formattedTotalSize}</div>
                <div className="text-xs text-slate-500 mt-1">Uncompressed Volume</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{totalRecords > 0 ? totalRecords.toLocaleString() : analysis.images.length}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {totalRecords > 0 ? 'Data Records Parsed' : 'Media Assets Extracted'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">
                  {analysis.markdownDocs.length + analysis.csvDatasets.length + (analysis.hasIndexHtml ? 1 : 0)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Interactive Modules</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Static Site Banner if index.html present */}
      {analysis.hasIndexHtml && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Static Web Application Detected ({analysis.indexHtmlFile?.path})
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  The archive contains a complete web entry point with rewritten relative CSS, JS, and image paths.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('live-preview')}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <span>Open in Sandbox Viewer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION: Interactive Documentation Articles */}
      {theme.showDocsSection && analysis.markdownDocs.length > 0 && (
        <section id="docs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Documentation & Knowledge Base
              </h2>
              <p className="text-sm text-slate-500">
                Rendered from extracted Markdown documents
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Left Nav List */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                Available Articles ({analysis.markdownDocs.length})
              </div>
              <div className="space-y-1">
                {analysis.markdownDocs.map((doc, idx) => (
                  <button
                    key={doc.path}
                    type="button"
                    onClick={() => setSelectedDocIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                      selectedDocIndex === idx
                        ? 'bg-white shadow-xs border border-slate-200 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                    }`}
                  >
                    <div className="text-sm font-semibold truncate leading-snug">{doc.title}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-[11px] truncate max-w-[150px]">{doc.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.estimatedReadTime}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Markdown Body */}
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
              {activeDoc ? (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{activeDoc.title}</h3>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{activeDoc.path}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyDoc(activeDoc.content)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDoc ? 'Copied' : 'Copy Raw'}</span>
                    </button>
                  </div>

                  <div
                    className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-sky-600 prose-code:font-mono prose-code:text-xs prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl text-slate-700 leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{ __html: marked.parse(activeDoc.content) as string }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">Select an article from the left</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION: Dynamic Data Tables (CSV / JSON) */}
      {theme.showDataSection && analysis.csvDatasets.length > 0 && (
        <section id="data-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Data Tables & Insights
              </h2>
              <p className="text-sm text-slate-500">
                Interactive data explorer parsed from {analysis.csvDatasets.length} CSV dataset(s)
              </p>
            </div>

            {/* Dataset Selector Tabs if multiple */}
            {analysis.csvDatasets.length > 1 && (
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start sm:self-auto">
                {analysis.csvDatasets.map((ds, idx) => (
                  <button
                    key={ds.path}
                    type="button"
                    onClick={() => {
                      setSelectedCsvIndex(idx);
                      setTableSearch('');
                      setSortCol(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedCsvIndex === idx
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ds.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeCsv && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Quick column summary cards */}
              {activeCsv.numericColumns.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50/70 border-b border-slate-200">
                  {activeCsv.numericColumns.slice(0, 4).map((col) => {
                    const stats = getColumnStats(col);
                    if (!stats) return null;
                    return (
                      <div key={col} className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase truncate">
                          {col} (Sum / Avg)
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">
                          {stats.sum >= 1000 ? stats.sum.toLocaleString() : stats.sum.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Avg: {stats.avg.toFixed(1)} · Max: {stats.max}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table Toolbar */}
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search within ${activeCsv.totalRows} records...`}
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 justify-between sm:justify-end">
                  <span>
                    Showing <strong className="text-slate-800">{processedRows.length}</strong> of{' '}
                    <strong>{activeCsv.totalRows}</strong> rows
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const file = analysis.files.find((f) => f.path === activeCsv.path);
                      if (file && file.blobUrl) {
                        const a = document.createElement('a');
                        a.href = file.blobUrl;
                        a.download = activeCsv.name + '.csv';
                        a.click();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-bold sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
                      {activeCsv.headers.map((h) => (
                        <th
                          key={h}
                          onClick={() => {
                            if (sortCol === h) {
                              setSortAsc(!sortAsc);
                            } else {
                              setSortCol(h);
                              setSortAsc(true);
                            }
                          }}
                          className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/80 transition-colors whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1">
                            <span>{h}</span>
                            {sortCol === h && (
                              <span className="text-sky-600 font-bold">{sortAsc ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {processedRows.slice(0, 100).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        {activeCsv.headers.map((h) => (
                          <td key={h} className="py-2 px-3 text-slate-700 whitespace-nowrap">
                            {row[h] !== undefined && row[h] !== null ? String(row[h]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {processedRows.length === 0 && (
                      <tr>
                        <td colSpan={activeCsv.headers.length + 1} className="py-8 text-center text-slate-400">
                          No matching records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {processedRows.length > 100 && (
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                  Showing first 100 rows. Use the search filter to narrow results.
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* SECTION: Media & Gallery */}
      {theme.showGallerySection && analysis.images.length > 0 && (
        <section id="gallery-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Media & Visual Assets
              </h2>
              <p className="text-sm text-slate-500">
                {analysis.images.length} image asset(s) extracted from the archive
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {analysis.images.map((img) => (
              <div
                key={img.id}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div
                  onClick={() => setActiveLightboxImg(img)}
                  className="h-44 bg-slate-100 flex items-center justify-center p-3 relative cursor-pointer overflow-hidden"
                >
                  <img
                    src={img.blobUrl}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-2 bg-white/90 text-slate-900 rounded-lg shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <div className="font-semibold text-slate-900 truncate" title={img.name}>
                      {img.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {img.formattedSize}
                    </div>
                  </div>
                  <a
                    href={img.blobUrl}
                    download={img.name}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    title="Download asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION: File Tree Overview */}
      {theme.showFileTree && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Extracted Files Directory
              </h2>
              <p className="text-sm text-slate-500">
                {analysis.totalFiles} files in total across all subfolders
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('files')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer"
            >
              <span>Open in Full Code Inspector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {analysis.files.slice(0, 15).map((file) => (
              <div
                key={file.id}
                onClick={() => onInspectFile(file)}
                className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="text-slate-400">
                    {file.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-rose-500" />
                    ) : file.type === 'csv' ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    ) : file.type === 'markdown' ? (
                      <FileText className="w-4 h-4 text-indigo-500" />
                    ) : file.type === 'html' ? (
                      <Code2 className="w-4 h-4 text-sky-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <span className="font-mono text-xs text-slate-800 font-medium">{file.path}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{file.formattedSize}</span>
                  <span className="text-sky-600 font-sans hover:underline">Inspect</span>
                </div>
              </div>
            ))}
            {analysis.files.length > 15 && (
              <div className="py-3 text-center text-xs text-slate-500">
                + {analysis.files.length - 15} more files. Click "Open in Full Code Inspector" to browse all.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div
          onClick={() => setActiveLightboxImg(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{activeLightboxImg.name}</h4>
                <div className="text-xs text-slate-400 font-mono">{activeLightboxImg.formattedSize} · {activeLightboxImg.path}</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeLightboxImg.blobUrl}
                  download={activeLightboxImg.name}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Download Asset
                </a>
                <button
                  type="button"
                  onClick={() => setActiveLightboxImg(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={activeLightboxImg.blobUrl}
                alt={activeLightboxImg.name}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
