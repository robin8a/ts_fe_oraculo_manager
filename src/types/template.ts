export interface Template {
  id: string;
  name: string;
  description?: string | null;
  type: number;
  version?: string | null;
  is_latest: boolean;
  templateParent?: Template | null;
  templateTemplatesId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string | null;
  type?: number | null;
  version?: string | null;
  is_latest?: boolean | null;
  templateTemplatesId?: string | null;
}

export interface UpdateTemplateInput {
  id: string;
  name?: string;
  description?: string | null;
  type?: number | null;
  version?: string | null;
  is_latest?: boolean | null;
  templateTemplatesId?: string | null;
}


