import JSZip from 'jszip';
import { ArchiveAnalysis, CsvDataset, ExtractedFile, FileType, JsonDataset, MarkdownDoc } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function detectFileType(path: string): FileType {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return 'css';
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'mjs':
    case 'cjs':
      return 'js';
    case 'json':
    case 'json5':
      return 'json';
    case 'csv':
    case 'tsv':
      return 'csv';
    case 'md':
    case 'markdown':
    case 'mdx':
      return 'markdown';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'bmp':
    case 'ico':
      return 'image';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
      return 'audio';
    case 'pdf':
      return 'pdf';
    case 'txt':
    case 'log':
    case 'env':
    case 'xml':
    case 'yaml':
    case 'yml':
    case 'sql':
    case 'sh':
    case 'py':
    case 'rs':
    case 'go':
    case 'java':
    case 'c':
    case 'cpp':
    case 'php':
      return 'text';
    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
      return 'archive';
    default:
      return 'binary';
  }
}

// Simple robust CSV parser (handles commas, quotes, trim)
export function parseCSV(text: string): { headers: string[]; rows: Record<string, string | number>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map((h, i) => h.replace(/^["']|["']$/g, '').trim() || `Col_${i + 1}`);

  const rows: Record<string, string | number>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 1 && values[0] === '') continue;
    const rowObj: Record<string, string | number> = {};
    headers.forEach((header, idx) => {
      let val = values[idx] ?? '';
      val = val.replace(/^["']|["']$/g, '');
      const numVal = Number(val);
      if (val !== '' && !isNaN(numVal) && !isNaN(parseFloat(val))) {
        rowObj[header] = numVal;
      } else {
        rowObj[header] = val;
      }
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

export function extractMarkdownTitle(content: string, fallbackName: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].replace(/[#*`_]/g, '').trim();
  }
  const cleanName = fallbackName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
}

export function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export async function extractZipArchive(
  fileOrBuffer: File | ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number, status: string) => void
): Promise<ArchiveAnalysis> {
  onProgress?.(10, 'Reading archive header...');
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(fileOrBuffer);

  const fileEntries: { path: string; entry: JSZip.JSZipObject }[] = [];
  loadedZip.forEach((relativePath, entry) => {
    if (!entry.dir && !relativePath.startsWith('__MACOSX/') && !relativePath.endsWith('.DS_Store')) {
      fileEntries.push({ path: relativePath, entry });
    }
  });

  const total = fileEntries.length;
  onProgress?.(25, `Found ${total} files. Extracting contents...`);

  const extractedFiles: ExtractedFile[] = [];
  const pathToBlobUrl: Record<string, string> = {};
  const pathToContent: Record<string, string> = {};

  const typeCounts: Record<FileType, number> = {
    html: 0,
    css: 0,
    js: 0,
    json: 0,
    csv: 0,
    markdown: 0,
    image: 0,
    audio: 0,
    pdf: 0,
    text: 0,
    archive: 0,
    binary: 0,
  };

  let totalSize = 0;

  for (let i = 0; i < total; i++) {
    const { path, entry } = fileEntries[i];
    const type = detectFileType(path);
    typeCounts[type] = (typeCounts[type] || 0) + 1;

    const parts = path.split('/');
    const name = parts[parts.length - 1];
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
    const extension = name.includes('.') ? name.split('.').pop()?.toLowerCase() || '' : '';

    let content: string | undefined;
    let blobUrl: string | undefined;
    let rawBlob: Blob | undefined;
    let fileSize = 0;

    // Check if text-based file
    if (['html', 'css', 'js', 'json', 'csv', 'markdown', 'text'].includes(type)) {
      content = await entry.async('string');
      fileSize = content.length;
      totalSize += fileSize;
      pathToContent[path] = content;
      // also create blob for downloading or embedding
      const mime =
        type === 'html'
          ? 'text/html'
          : type === 'css'
          ? 'text/css'
          : type === 'js'
          ? 'application/javascript'
          : type === 'json'
          ? 'application/json'
          : type === 'csv'
          ? 'text/csv'
          : type === 'markdown'
          ? 'text/markdown'
          : 'text/plain';
      rawBlob = new Blob([content], { type: mime });
      blobUrl = URL.createObjectURL(rawBlob);
      pathToBlobUrl[path] = blobUrl;
    } else {
      // Binary or image file
      const arrayBuffer = await entry.async('arraybuffer');
      fileSize = arrayBuffer.byteLength;
      totalSize += fileSize;

      let mimeType = 'application/octet-stream';
      if (type === 'image') {
        mimeType =
          extension === 'svg'
            ? 'image/svg+xml'
            : extension === 'png'
            ? 'image/png'
            : extension === 'gif'
            ? 'image/gif'
            : extension === 'webp'
            ? 'image/webp'
            : 'image/jpeg';
      } else if (type === 'audio') {
        mimeType = extension === 'wav' ? 'audio/wav' : 'audio/mpeg';
      } else if (type === 'pdf') {
        mimeType = 'application/pdf';
      }

      rawBlob = new Blob([arrayBuffer], { type: mimeType });
      blobUrl = URL.createObjectURL(rawBlob);
      pathToBlobUrl[path] = blobUrl;
    }

    const linesCount = content ? content.split('\n').length : undefined;

    extractedFiles.push({
      id: `${path}_${i}`,
      path,
      name,
      folder,
      extension,
      size: fileSize,
      formattedSize: formatBytes(fileSize),
      type,
      content,
      blobUrl,
      rawBlob,
      lastModified: entry.date,
      linesCount,
    });

    if (i % 5 === 0 || i === total - 1) {
      const pct = 25 + Math.round(((i + 1) / total) * 50);
      onProgress?.(pct, `Processing file ${i + 1} of ${total}: ${name}`);
    }
  }

  onProgress?.(80, 'Analyzing data sets & structures...');

  // Identify CSV datasets
  const csvDatasets: CsvDataset[] = [];
  for (const f of extractedFiles) {
    if (f.type === 'csv' && f.content) {
      try {
        const { headers, rows } = parseCSV(f.content);
        const numericColumns = headers.filter((h) =>
          rows.length > 0 && rows.some((r) => typeof r[h] === 'number')
        );
        csvDatasets.push({
          name: f.name.replace(/\.csv$/i, ''),
          path: f.path,
          headers,
          rows,
          totalRows: rows.length,
          numericColumns,
        });
      } catch (err) {
        console.warn('Failed parsing CSV:', f.path, err);
      }
    }
  }

  // Identify JSON datasets
  const jsonDatasets: JsonDataset[] = [];
  for (const f of extractedFiles) {
    if (f.type === 'json' && f.content) {
      try {
        const parsed = JSON.parse(f.content);
        const isArray = Array.isArray(parsed);
        const keys = isArray
          ? parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null
            ? Object.keys(parsed[0])
            : []
          : typeof parsed === 'object' && parsed !== null
          ? Object.keys(parsed)
          : [];

        jsonDatasets.push({
          name: f.name.replace(/\.json$/i, ''),
          path: f.path,
          data: parsed,
          isArray,
          itemCount: isArray ? parsed.length : Object.keys(parsed || {}).length,
          keys,
        });
      } catch (err) {
        console.warn('Failed parsing JSON:', f.path, err);
      }
    }
  }

  // Identify Markdown documents
  const markdownDocs: MarkdownDoc[] = [];
  for (const f of extractedFiles) {
    if (f.type === 'markdown' && f.content) {
      const title = extractMarkdownTitle(f.content, f.name);
      markdownDocs.push({
        name: f.name,
        path: f.path,
        title,
        content: f.content,
        estimatedReadTime: estimateReadTime(f.content),
      });
    }
  }

  // Identify Images
  const images = extractedFiles.filter((f) => f.type === 'image' && f.blobUrl);

  // Look for index.html or root HTML file
  const indexHtmlFile =
    extractedFiles.find((f) => f.name.toLowerCase() === 'index.html') ||
    extractedFiles.find((f) => f.type === 'html');

  let previewHtmlBlobUrl: string | undefined;

  // Build live preview HTML if HTML file exists
  if (indexHtmlFile && indexHtmlFile.content) {
    try {
      let rewrittenHtml = indexHtmlFile.content;
      // Rewrite relative references: href="...", src="..."
      for (const [filePath, bUrl] of Object.entries(pathToBlobUrl)) {
        const justName = filePath.split('/').pop() || filePath;
        // Escape special chars for regex
        const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        // Exact match relative paths like ./style.css or style.css or images/photo.jpg
        const pathRegex = new RegExp(`(src|href)=["'](\\.\\/)?${escapeRegex(filePath)}["']`, 'gi');
        rewrittenHtml = rewrittenHtml.replace(pathRegex, `$1="${bUrl}"`);

        const nameRegex = new RegExp(`(src|href)=["'](\\.\\/)?${escapeRegex(justName)}["']`, 'gi');
        rewrittenHtml = rewrittenHtml.replace(nameRegex, `$1="${bUrl}"`);
      }

      const previewBlob = new Blob([rewrittenHtml], { type: 'text/html' });
      previewHtmlBlobUrl = URL.createObjectURL(previewBlob);
    } catch (e) {
      console.warn('Could not rewrite HTML for preview', e);
      previewHtmlBlobUrl = indexHtmlFile.blobUrl;
    }
  }

  // Determine detected archetype
  let detectedType: ArchiveAnalysis['detectedType'] = 'mixed';
  if (indexHtmlFile && (typeCounts.html > 0 || typeCounts.css > 0)) {
    detectedType = 'static-site';
  } else if (csvDatasets.length > 0 || (jsonDatasets.length > 0 && jsonDatasets.some((j) => j.isArray))) {
    detectedType = 'dataset';
  } else if (markdownDocs.length >= 2 || (markdownDocs.length === 1 && extractedFiles.length <= 4)) {
    detectedType = 'documentation';
  } else if (images.length >= 3 && typeCounts.js === 0 && typeCounts.html === 0) {
    detectedType = 'media-gallery';
  } else if (typeCounts.js > 2 || typeCounts.text > 3) {
    detectedType = 'code-project';
  }

  // Deduce Primary Title and Summary
  let primaryTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  primaryTitle = primaryTitle.charAt(0).toUpperCase() + primaryTitle.slice(1);

  if (markdownDocs.length > 0 && (!primaryTitle || primaryTitle === 'Archive' || primaryTitle === 'Upload')) {
    primaryTitle = markdownDocs[0].title;
  }

  let summaryDescription = `Extracted archive with ${total} files (${formatBytes(totalSize)}). `;
  if (detectedType === 'static-site') {
    summaryDescription += 'Detected complete static web application with HTML entry point.';
  } else if (detectedType === 'dataset') {
    summaryDescription += `Includes ${csvDatasets.length} CSV dataset(s) and ${jsonDatasets.length} structured JSON resource(s).`;
  } else if (detectedType === 'documentation') {
    summaryDescription += `Includes ${markdownDocs.length} documentation article(s) and reference guides.`;
  } else if (detectedType === 'media-gallery') {
    summaryDescription += `Contains ${images.length} high-fidelity graphic assets and media files.`;
  } else {
    summaryDescription += `Contains ${extractedFiles.length} project files across multiple formats.`;
  }

  onProgress?.(100, 'Website ready!');

  return {
    archiveName: fileName,
    totalFiles: total,
    totalSize,
    formattedTotalSize: formatBytes(totalSize),
    detectedType,
    hasIndexHtml: !!indexHtmlFile,
    indexHtmlFile,
    previewHtmlBlobUrl,
    primaryTitle,
    summaryDescription,
    typeCounts,
    csvDatasets,
    jsonDatasets,
    markdownDocs,
    images,
    files: extractedFiles,
  };
}
