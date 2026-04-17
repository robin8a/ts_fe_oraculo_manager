/** Minimal shape for parent/child in lists */
export interface ModelAIRef {
  id: string;
  name: string;
}

export interface ModelAI {
  id: string;
  group?: string | null;
  name: string;
  description: string;
  document_link: string;
  api_link: string;
  version: string;
  is_latest: boolean;
  is_approved: boolean;
  tokens_cost: number;
  cost_tokens: number;
  modelAIModelAIParentId?: string | null;
  modelAIParent?: ModelAIRef | null;
  modelAIs?: ModelAIRef[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModelAIInput {
  group?: string | null;
  name: string;
  description: string;
  document_link: string;
  api_link: string;
  version: string;
  is_latest: boolean;
  is_approved: boolean;
  tokens_cost: number;
  cost_tokens: number;
  modelAIModelAIParentId?: string | null;
}

export interface UpdateModelAIInput {
  id: string;
  group?: string | null;
  name?: string;
  description?: string;
  document_link?: string;
  api_link?: string;
  version?: string;
  is_latest?: boolean;
  is_approved?: boolean;
  tokens_cost?: number;
  cost_tokens?: number;
  modelAIModelAIParentId?: string | null;
}




