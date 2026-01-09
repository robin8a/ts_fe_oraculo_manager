export interface ModelAI {
  id: string;
  name: string;
  description: string;
  document_link: string;
  api_link: string;
  version: string;
  is_approved: boolean;
  tokens_cost: number;
  cost_tokens: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModelAIInput {
  name: string;
  description: string;
  document_link: string;
  api_link: string;
  version: string;
  is_approved: boolean;
  tokens_cost: number;
  cost_tokens: number;
}

export interface UpdateModelAIInput {
  id: string;
  name?: string;
  description?: string;
  document_link?: string;
  api_link?: string;
  version?: string;
  is_approved?: boolean;
  tokens_cost?: number;
  cost_tokens?: number;
}




