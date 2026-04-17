export const SATELLITE_TOPOLOGY_TYPES = ['SATELLITE', 'BAND'] as const;
export type SatelliteTopologyType = (typeof SATELLITE_TOPOLOGY_TYPES)[number];

export interface SatelliteTopology {
  id: string;
  type: string;
  name: string;
  description: string;
  /** Amplify FK to parent (parent has `satelliteTopologies`); optional on read if API shape differs */
  satelliteTopologySatelliteTopologiesId?: string | null;
  satelliteTopologyParent?: { id: string; name: string; type?: string | null } | null;
  satelliteTopologies?: { items: Array<{ id: string; name: string }> | null } | null;
  createdAt?: string;
  updatedAt?: string;
}
