import React from 'react';
import {
  Archive,
  BarChart3,
  Code2,
  Download,
  Eye,
  FileCode,
  Globe,
  Layers,
  Palette,
  RefreshCw,
  Sparkles,
  Upload,
} from 'lucide-react';
import { ActiveTab, ArchiveAnalysis } from '../types';

interface HeaderProps {
  analysis: ArchiveAnalysis | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewZipClick: () => void;
  onExportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  analysis,
  activeTab,
  setActiveTab,
  onNewZipClick,
  onExportClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Current Archive Identity */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <Globe className="w-5 h-5 text-sky-400" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                  <span>ZipSite</span>
                  <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                    Live
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Instant Archive Extractor & Site Builder
                </div>
              </div>
            </div>

            {analysis && (
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-600 truncate">
                <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={analysis.archiveName}>
                  {analysis.archiveName}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{analysis.totalFiles} files</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{analysis.formattedTotalSize}</span>
              </div>
            )}
          </div>

          {/* Center Tabs Navigation */}
          {analysis && (
            <div className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab('website')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'website'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Prepared Website</span>
              </button>

              {analysis.hasIndexHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('live-preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'live-preview'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Live Static Preview</span>
                </button>
              )}

              {(analysis.csvDatasets.length > 0 || analysis.jsonDatasets.length > 0) && (
                <button
                  type="button"
                  onClick={() => setActiveTab('data')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'data'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Data & Tables ({analysis.csvDatasets.length + analysis.jsonDatasets.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('files')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'files'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Files & Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'theme'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-purple-500" />
                <span>Customizer</span>
              </button>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {analysis ? (
              <>
                <button
                  type="button"
                  onClick={onNewZipClick}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Upload another ZIP archive"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload New ZIP</span>
                </button>

                <button
                  type="button"
                  onClick={onExportClick}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </>
            ) : (
              <span className="text-xs text-slate-400">Ready for ZIP upload</span>
            )}
          </div>
        </div>

        {/* Mobile Subnav if analysis exists */}
        {analysis && (
          <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('website')}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md ${
                activeTab === 'website' ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Prepared Website</span>
            </button>
            {analysis.hasIndexHtml && (
              <button
                type="button"
                onClick={() => setActiveTab('live-preview')}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md ${
                  activeTab === 'live-preview' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Live Preview</span>
              </button>
            )}
            {(analysis.csvDatasets.length > 0 || analysis.jsonDatasets.length > 0) && (
              <button
                type="button"
                onClick={() => setActiveTab('data')}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md ${
                  activeTab === 'data' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Data</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md ${
                activeTab === 'files' ? 'bg-amber-50 text-amber-700' : 'text-slate-600'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Files</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md ${
                activeTab === 'theme' ? 'bg-purple-50 text-purple-700' : 'text-slate-600'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>Theme</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
