export interface SatelliteTopologyRef {
  id: string;
  name: string;
  type?: string | null;
}

export interface SatelliteTopologyModelAI {
  id: string;
  modelAISatelliteTopologyModelAIsId?: string | null;
  satelliteTopologySatelliteTopologyModelAIsId?: string | null;
  satelliteTopology?: SatelliteTopologyRef | null;
  modelAI?: { id: string; name?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SatelliteTopologyAssociationSelection {
  parentId: string;
  childIds: string[];
}
