export interface KoboToolboxConfig {
  serverUrl: string;
  apiKey: string;
  projectUid: string;
  format: 'json' | 'csv';
}

export interface KoboToolboxRow {
  [key: string]: any;
  _id?: string;
  _uuid?: string;
  _submission_time?: string;
  _attachments?: Array<{
    download_url: string;
    filename: string;
    mimetype: string;
  }>;
}

export interface ImportProgress {
  stage: 'idle' | 'fetching' | 'parsing' | 'processing' | 'uploading' | 'completed' | 'error';
  message: string;
  currentRow?: number;
  totalRows?: number;
  currentFeature?: string;
  progress?: number; // 0-100
  currentStep?: string;
  stepNumber?: number;
  totalSteps?: number;
  featuresProcessed?: number;
  totalFeatures?: number;
  treesProcessed?: number;
  rawDataProcessed?: number;
  audioFilesProcessed?: number;
}

export interface ImportResult {
  success: boolean;
  projectId?: string;
  treesCreated: number;
  featuresCreated: number;
  featuresSkipped: number;
  rawDataCreated: number;
  audioFilesUploaded: number;
  errors: string[];
}

export interface Feature {
  id: string;
  name: string;
  feature_type?: string;
  is_float?: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: string;
}

export interface Tree {
  id: string;
  name: string;
  status?: string;
  projectId: string;
}

