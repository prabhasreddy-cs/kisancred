import React, { useRef, useState } from 'react';
import { Archive, ArrowRight, CheckCircle2, FileArchive, HardDrive, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { sampleArchives, SampleArchiveOption } from '../utils/sampleArchives';

interface DropZoneProps {
  onFileSelected: (file: File | Blob, name: string) => Promise<void>;
  isProcessing: boolean;
  progressPercent: number;
  progressStatus: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelected,
  isProcessing,
  progressPercent,
  progressStatus,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip')) {
        await onFileSelected(file, file.name);
      } else {
        alert('Please drop a valid .zip file.');
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await onFileSelected(file, file.name);
    }
  };

  const handleSampleClick = async (sample: SampleArchiveOption) => {
    if (isProcessing) return;
    try {
      setSelectedSampleId(sample.id);
      const blob = await sample.generateZip();
      await onFileSelected(blob, sample.fileName);
    } catch (err) {
      console.error('Error generating sample:', err);
    } finally {
      setSelectedSampleId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner & Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-md mb-3 border border-sky-100">
          <FileArchive className="w-3.5 h-3.5 text-sky-600" />
          <span>ZIP Extractor & Live Web Site Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Drop your ZIP archive, we build the website.
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Extracts files in real-time, visualizes data tables and documentation, rewrites static site paths for live sandboxed preview, and creates a tailored, responsive experience.
        </p>
      </div>

      {/* Main Dropzone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-sky-500 bg-sky-50/70 scale-[1.01] shadow-lg shadow-sky-100'
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="py-6 flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-4 animate-pulse">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Extracting & Preparing Website</h3>
            <p className="text-xs text-slate-500 mb-4">{progressStatus}</p>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-sky-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">{progressPercent}% completed</span>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Select or drag and drop your ZIP file here
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Supports complete website zips, datasets (CSV / JSON), document archives, and image bundles
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              <span>Browse ZIP from Computer</span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span>Client-side extraction</span>
              <span aria-hidden="true">·</span>
              <span>Fast & zero cloud delay</span>
              <span aria-hidden="true">·</span>
              <span>No file size limits</span>
            </div>
          </div>
        )}
      </div>

      {/* Instant Demo Archives Selector */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Or Try Instantly with Ready-Made Sample ZIPs
            </h2>
            <p className="text-xs text-slate-500">
              Click any sample archive below to test extraction and generate the corresponding website right away.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleArchives.map((sample) => {
            const isThisSampleLoading = isProcessing && selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleClick(sample)}
                disabled={isProcessing}
                className="text-left bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between group disabled:opacity-50 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">{sample.badge}</span>
                    <span className="text-xs font-mono text-slate-400">.zip</span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors text-sm mb-1 leading-snug">
                    {sample.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {sample.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="text-slate-400 truncate max-w-[140px] font-mono text-[11px]">
                    {sample.fileName}
                  </span>
                  <div className="flex items-center gap-1 text-sky-600 group-hover:translate-x-0.5 transition-transform">
                    {isThisSampleLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Extract</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
