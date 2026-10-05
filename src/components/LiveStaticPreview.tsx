import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Laptop,
  Maximize2,
  Monitor,
  RefreshCw,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { ArchiveAnalysis } from '../types';

interface LiveStaticPreviewProps {
  analysis: ArchiveAnalysis;
  onInspectHtml: () => void;
}

export const LiveStaticPreview: React.FC<LiveStaticPreviewProps> = ({
  analysis,
  onInspectHtml,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  const previewUrl = analysis.previewHtmlBlobUrl || analysis.indexHtmlFile?.blobUrl;

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  if (!previewUrl) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          No HTML entry point (index.html) was discovered in this archive. Check the "Prepared Website" or "Files" view to explore your extracted data.
        </div>
      </div>
    );
  }

  const containerWidthClass =
    deviceMode === 'mobile'
      ? 'max-w-[390px]'
      : deviceMode === 'tablet'
      ? 'max-w-[820px]'
      : 'w-full';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-slate-100">
      {/* Top Browser Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Window Dots & Virtual URL */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-xs text-slate-400 font-mono truncate max-w-sm sm:max-w-md">
            <span className="text-emerald-400 font-semibold">sandbox://</span>
            <span className="truncate">{analysis.indexHtmlFile?.path || 'index.html'}</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded transition-colors cursor-pointer"
            title="Reload sandbox preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet 768px"
          >
            <Laptop className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onInspectHtml}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Source</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewTab}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Tab</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
        <div
          className={`h-full transition-all duration-300 bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-850 flex flex-col ${containerWidthClass}`}
        >
          <iframe
            key={iframeKey}
            src={previewUrl}
            title="Static Website Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
