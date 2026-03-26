import React, { useEffect, useMemo } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { PolygonFeature } from '../../types/topology';

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Distinct colors for ancestor polygons (leaf is always red). */
export const ANCESTOR_PALETTE = [
  '#2563eb',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#db2777',
  '#0d9488',
  '#4f46e5',
];

const LEAF_COLOR = '#dc2626';

function FitAllBounds({ features }: { features: PolygonFeature[] }) {
  const map = useMap();
  useEffect(() => {
    const b = L.latLngBounds([]);
    features.forEach((f) => {
      const layer = L.geoJSON(f as GeoJSON.GeoJSON);
      const lb = layer.getBounds();
      if (lb.isValid()) b.extend(lb);
    });
    if (b.isValid()) {
      map.fitBounds(b, { padding: [40, 40], maxZoom: 16 });
    }
  }, [map, features]);
  return null;
}

export interface TopologyPolygonViewerProps {
  /** Current topology polygon (leaf) — required for map to render. */
  leaf: PolygonFeature;
  /** Root → … → immediate parent (each with polygon). */
  ancestors: Array<{ id: string; name?: string | null; feature: PolygonFeature }>;
  className?: string;
}

export const TopologyPolygonViewer: React.FC<TopologyPolygonViewerProps> = ({
  leaf,
  ancestors,
  className,
}) => {
  const allFeatures = useMemo(() => {
    return [...ancestors.map((a) => a.feature), leaf];
  }, [ancestors, leaf]);

  return (
    <div className={className ?? ''}>
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        {ancestors.map((a, i) => (
          <span key={a.id} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-gray-300"
              style={{ backgroundColor: ANCESTOR_PALETTE[i % ANCESTOR_PALETTE.length] }}
            />
            <span className="text-gray-700">{a.name || a.id}</span>
            <span className="text-gray-400">(ancestor)</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span
            className="inline-block h-3 w-3 rounded-sm border border-gray-300"
            style={{ backgroundColor: LEAF_COLOR }}
          />
          <span className="text-gray-900">This topology</span>
        </span>
      </div>
      <div className="h-[420px] w-full rounded-lg border border-gray-200 overflow-hidden z-0">
        <MapContainer center={[4.65, -74.05]} zoom={6} className="h-full w-full" scrollWheelZoom>
          <TileLayer attribution={OSM_ATTRIBUTION} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitAllBounds features={allFeatures} />
          {ancestors.map((a, i) => (
            <GeoJSON
              key={a.id}
              data={a.feature as GeoJSON.GeoJSON}
              style={{
                color: ANCESTOR_PALETTE[i % ANCESTOR_PALETTE.length],
                weight: 2,
                fillOpacity: 0.22,
                fillColor: ANCESTOR_PALETTE[i % ANCESTOR_PALETTE.length],
              }}
            />
          ))}
          <GeoJSON
            data={leaf as GeoJSON.GeoJSON}
            style={{
              color: LEAF_COLOR,
              weight: 3,
              fillOpacity: 0.35,
              fillColor: LEAF_COLOR,
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};
