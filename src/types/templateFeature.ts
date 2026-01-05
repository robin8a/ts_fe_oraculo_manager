import type { Feature } from './feature';

export interface Template {
  id: string;
  name: string;
  description?: string | null;
  type: number;
  version?: string | null;
  is_latest: boolean;
  templateTemplatesId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateFeature {
  id: string;
  template?: Template | null;
  feature?: Feature | null;
  templateTemplateFeaturesId?: string | null;
  featureTemplateFeaturesId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateFeatureInput {
  templateTemplateFeaturesId: string;
  featureTemplateFeaturesId: string;
}

export interface UpdateTemplateFeatureInput {
  id: string;
  templateTemplateFeaturesId?: string | null;
  featureTemplateFeaturesId?: string | null;
}

