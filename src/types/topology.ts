import type { Feature, MultiPolygon, Polygon } from 'geojson';

export interface TopologyParentRef {
  id: string;
  name?: string | null;
  polygon?: unknown;
}

export interface TopologyProjectRef {
  id: string;
  name?: string | null;
  status?: string | null;
}

export interface Topology {
  id: string;
  name: string;
  string_code?: string | null;
  number_code?: string | null;
  status?: string | null;
  polygon?: unknown;
  project?: TopologyProjectRef | null;
  topologyParent?: TopologyParentRef | null;
  topologies?: { items?: Array<{ id: string; name: string } | null> | null } | null;
  createdAt?: string;
  updatedAt?: string;
  /** FK to Project (Amplify hasMany name on Project: `topologies`) */
  projectTopologiesId?: string | null;
  /** Normalized parent id from API variants */
  topologyTopologyParentId?: string | null;
}

export type PolygonFeature = Feature<Polygon | MultiPolygon>;

const MAX_CHAIN = 50;

export function parseJsonValue(raw: unknown): unknown {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }
  return raw;
}

function isPolygonOrMultiGeometry(g: unknown): g is Polygon | MultiPolygon {
  if (!g || typeof g !== 'object') return false;
  const t = (g as { type?: string }).type;
  return t === 'Polygon' || t === 'MultiPolygon';
}

/** Extract a Polygon/MultiPolygon Feature from AWSJSON (Feature, Geometry, FeatureCollection, or string). */
export function parsePolygonFeature(raw: unknown): PolygonFeature | null {
  const v = parseJsonValue(raw);
  if (!v) return null;

  if (typeof v === 'object' && v !== null && 'type' in v) {
    const t = (v as { type: string }).type;
    if (t === 'Feature') {
      const geom = (v as Feature).geometry;
      if (isPolygonOrMultiGeometry(geom)) {
        return v as PolygonFeature;
      }
      return null;
    }
    if (isPolygonOrMultiGeometry(v)) {
      return {
        type: 'Feature',
        properties: {},
        geometry: v,
      };
    }
    if (t === 'FeatureCollection') {
      const fc = v as GeoJSON.FeatureCollection;
      for (const f of fc.features ?? []) {
        if (f.geometry && isPolygonOrMultiGeometry(f.geometry)) {
          return {
            type: 'Feature',
            properties: f.properties ?? {},
            geometry: f.geometry,
          };
        }
      }
    }
  }
  return null;
}

export function hasRenderablePolygon(raw: unknown): boolean {
  return parsePolygonFeature(raw) != null;
}

/** Serialize for GraphQL AWSJSON (JSON string) or other APIs. */
export function polygonFeatureToAwsJson(feature: PolygonFeature): string {
  return JSON.stringify(feature);
}

export function normalizeTopologyParentId(item: unknown): string | null {
  if (!item || typeof item !== 'object') return null;
  const o = item as Record<string, unknown>;
  return (
    (o.topologyTopologyParentId as string | undefined) ??
    (o.topologyParentId as string | undefined) ??
    null
  );
}

/**
 * Walk up from the current topology’s parent: [immediate parent, …, root].
 * Returns reversed order [root, …, immediate parent] for stable bottom-to-top drawing.
 */
export async function fetchTopologyAncestorPolygons(
  getOne: (id: string) => Promise<Topology | null>,
  current: Topology
): Promise<Array<{ id: string; name?: string | null; feature: PolygonFeature }>> {
  const chain: Array<{ id: string; name?: string | null; feature: PolygonFeature }> = [];
  const seen = new Set<string>();
  let parentId: string | null = current.topologyParent?.id ?? null;
  let hops = 0;

  while (parentId && hops < MAX_CHAIN) {
    if (seen.has(parentId)) break;
    seen.add(parentId);
    hops += 1;
    const node = await getOne(parentId);
    if (!node) break;
    const feat = parsePolygonFeature(node.polygon);
    if (feat) {
      chain.push({ id: node.id, name: node.name, feature: feat });
    }
    parentId = node.topologyParent?.id ?? null;
  }

  return chain.reverse();
}
