// Types for Project Tree Feature drill-down hierarchy

export interface RawDataInfo {
  id: string;
  name: string | null;
  valueFloat: number | null;
  valueString: string | null;
  start_date: string | null;
  end_date: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FeatureInfo {
  id: string;
  name: string;
  feature_type: string | null;
  feature_group: string | null;
  description: string | null;
  default_value: number | null;
  is_float: boolean | null;
  rawData: RawDataInfo[];
}

export interface TreeWithFeatures {
  id: string;
  name: string;
  status: string | null;
  projectTreesId: string | null;
  templateTreesId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  features: FeatureInfo[];
}

export interface ProjectWithTrees {
  id: string;
  name: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  trees: TreeWithFeatures[];
}

