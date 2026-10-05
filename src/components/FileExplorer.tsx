import React, { useMemo, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  ImageIcon,
  Search,
} from 'lucide-react';
import { ExtractedFile, FileType } from '../types';

interface FileExplorerProps {
  files: ExtractedFile[];
  initialSelectedFile?: ExtractedFile | null;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  initialSelectedFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<ExtractedFile>(
    initialSelectedFile || files[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'code' | 'data' | 'docs' | 'media'>('all');
  const [copied, setCopied] = useState(false);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      // Search
      const matchesSearch =
        f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Type filter
      if (typeFilter === 'code') {
        return ['html', 'css', 'js'].includes(f.type);
      }
      if (typeFilter === 'data') {
        return ['csv', 'json'].includes(f.type);
      }
      if (typeFilter === 'docs') {
        return ['markdown', 'text', 'pdf'].includes(f.type);
      }
      if (typeFilter === 'media') {
        return ['image', 'audio'].includes(f.type);
      }
      return true;
    });
  }, [files, searchQuery, typeFilter]);

  const handleCopy = () => {
    if (selectedFile.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-rose-500" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      case 'json':
        return <FileCode className="w-4 h-4 text-amber-500" />;
      case 'markdown':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'html':
      case 'css':
      case 'js':
        return <Code2 className="w-4 h-4 text-sky-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        {/* Left Column: Explorer Directory & List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                  typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All ({files.length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('code')}
                className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                  typeFilter === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('data')}
                className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                  typeFilter === 'data' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Data
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('docs')}
                className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                  typeFilter === 'docs' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Docs
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('media')}
                className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                  typeFilter === 'media' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Media
              </button>
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 max-h-[580px]">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile?.id === file.id;
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-100/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    {getFileIcon(file.type)}
                    <span className="truncate font-mono text-[11px]">{file.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    {file.formattedSize}
                  </span>
                </button>
              );
            })}

            {filteredFiles.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching files found
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Content Inspector */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          {selectedFile ? (
            <>
              {/* File Info Bar */}
              <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {getFileIcon(selectedFile.type)}
                  <div className="truncate">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm font-mono truncate">
                      {selectedFile.path}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{selectedFile.formattedSize}</span>
                      {selectedFile.linesCount && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{selectedFile.linesCount} lines</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="uppercase">{selectedFile.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFile.content && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}

                  {selectedFile.blobUrl && (
                    <a
                      href={selectedFile.blobUrl}
                      download={selectedFile.name}
                      className="inline-flex items-center gap-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>

              {/* File Content Area */}
              <div className="flex-1 overflow-auto p-4 bg-slate-950 text-slate-200 font-mono text-xs">
                {selectedFile.type === 'image' && selectedFile.blobUrl ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg">
                    <img
                      src={selectedFile.blobUrl}
                      alt={selectedFile.name}
                      className="max-h-[450px] max-w-full object-contain rounded border border-slate-700 mb-4"
                    />
                    <div className="text-slate-400 text-xs">
                      {selectedFile.name} ({selectedFile.formattedSize})
                    </div>
                  </div>
                ) : selectedFile.content !== undefined ? (
                  <pre className="overflow-x-auto whitespace-pre leading-relaxed select-text font-mono text-[11px]">
                    <code>{selectedFile.content}</code>
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 py-16">
                    Binary or non-text content. Use the download button above to inspect this file.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a file to inspect its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
