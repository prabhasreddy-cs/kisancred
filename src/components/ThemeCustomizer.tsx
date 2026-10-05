import React from 'react';
import { Check, Eye, Layout, Palette, RefreshCw, Type } from 'lucide-react';
import { SiteThemeConfig } from '../types';

interface ThemeCustomizerProps {
  theme: SiteThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<SiteThemeConfig>>;
  onPreviewSite: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  setTheme,
  onPreviewSite,
}) => {
  const handleToggle = (key: keyof SiteThemeConfig) => {
    setTheme((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Website Customizer & Controls
          </h1>
          <p className="text-sm text-slate-500">
            Fine-tune layout sections, titles, and display options for the prepared website
          </p>
        </div>

        <button
          type="button"
          onClick={onPreviewSite}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Prepared Website</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Branding & Titles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-4">
            <Type className="w-4 h-4 text-sky-600" />
            <span>Title & Subtitle</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website Headline
              </label>
              <input
                type="text"
                value={theme.customTitle}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, customTitle: e.target.value }))
                }
                placeholder="Leave blank to use detected archive title"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtitle & Lead Paragraph
              </label>
              <textarea
                rows={2}
                value={theme.customSubtitle}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, customSubtitle: e.target.value }))
                }
                placeholder="Leave blank to use automatic summary"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section Toggles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-4">
            <Layout className="w-4 h-4 text-emerald-600" />
            <span>Visible Website Sections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Hero Section</div>
                <div className="text-[11px] text-slate-500">Header title and quick jump links</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showHero}
                onChange={() => handleToggle('showHero')}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Metric Counters</div>
                <div className="text-[11px] text-slate-500">File count and data records summary</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showMetrics}
                onChange={() => handleToggle('showMetrics')}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Data & CSV Explorer</div>
                <div className="text-[11px] text-slate-500">Searchable tables and numeric aggregates</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showDataSection}
                onChange={() => handleToggle('showDataSection')}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Documentation Reader</div>
                <div className="text-[11px] text-slate-500">Rendered markdown guides & manuals</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showDocsSection}
                onChange={() => handleToggle('showDocsSection')}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Media Gallery</div>
                <div className="text-[11px] text-slate-500">Image grids and lightbox viewers</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showGallerySection}
                onChange={() => handleToggle('showGallerySection')}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">File Directory List</div>
                <div className="text-[11px] text-slate-500">Unpacked files inventory list</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showFileTree}
                onChange={() => handleToggle('showFileTree')}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
