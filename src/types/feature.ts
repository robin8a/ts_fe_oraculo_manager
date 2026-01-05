export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Feature {
  id: string;
  feature_type?: string | null;
  name: string;
  description?: string | null;
  feature_group?: string | null;
  default_value?: number | null;
  is_float?: boolean | null;
  unitOfMeasure?: UnitOfMeasure | null;
  unitOfMeasureFeaturesId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeatureInput {
  feature_type?: string | null;
  name: string;
  description?: string | null;
  feature_group?: string | null;
  default_value?: number | null;
  is_float?: boolean | null;
  unitOfMeasureFeaturesId?: string | null;
}

export interface UpdateFeatureInput {
  id: string;
  feature_type?: string | null;
  name?: string;
  description?: string | null;
  feature_group?: string | null;
  default_value?: number | null;
  is_float?: boolean | null;
  unitOfMeasureFeaturesId?: string | null;
}

