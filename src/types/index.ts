export type FileType =
  | 'html'
  | 'css'
  | 'js'
  | 'json'
  | 'csv'
  | 'markdown'
  | 'image'
  | 'audio'
  | 'pdf'
  | 'text'
  | 'archive'
  | 'binary';

export interface ExtractedFile {
  id: string;
  path: string;
  name: string;
  folder: string;
  extension: string;
  size: number;
  formattedSize: string;
  type: FileType;
  content?: string;
  blobUrl?: string;
  rawBlob?: Blob;
  lastModified?: Date;
  linesCount?: number;
}

export interface CsvDataset {
  name: string;
  path: string;
  headers: string[];
  rows: Record<string, string | number>[];
  totalRows: number;
  numericColumns: string[];
}

export interface JsonDataset {
  name: string;
  path: string;
  data: any;
  isArray: boolean;
  itemCount: number;
  keys: string[];
}

export interface MarkdownDoc {
  name: string;
  path: string;
  title: string;
  content: string;
  estimatedReadTime: string;
}

export interface ArchiveAnalysis {
  archiveName: string;
  totalFiles: number;
  totalSize: number;
  formattedTotalSize: string;
  detectedType: 'static-site' | 'dataset' | 'documentation' | 'media-gallery' | 'code-project' | 'mixed';
  hasIndexHtml: boolean;
  indexHtmlFile?: ExtractedFile;
  previewHtmlBlobUrl?: string;
  primaryTitle: string;
  summaryDescription: string;
  typeCounts: Record<FileType, number>;
  csvDatasets: CsvDataset[];
  jsonDatasets: JsonDataset[];
  markdownDocs: MarkdownDoc[];
  images: ExtractedFile[];
  files: ExtractedFile[];
}

export type ActiveTab = 'website' | 'live-preview' | 'files' | 'data' | 'theme';

export interface SiteThemeConfig {
  accentColor: string;
  accentClass: string;
  fontScale: 'compact' | 'normal' | 'spacious';
  customTitle: string;
  customSubtitle: string;
  showHero: boolean;
  showMetrics: boolean;
  showDataSection: boolean;
  showDocsSection: boolean;
  showGallerySection: boolean;
  showFileTree: boolean;
}
