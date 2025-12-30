// Types for Project Tree Feature drill-down hierarchy

export interface FeatureInfo {
  id: string;
  name: string;
  feature_type: string | null;
  feature_group: string | null;
  description: string | null;
  default_value: number | null;
  is_float: boolean | null;
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

