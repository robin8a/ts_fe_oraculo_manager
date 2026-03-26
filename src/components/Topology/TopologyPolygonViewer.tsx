import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { PolygonFeature } from '../../types/topology';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from './mapDefaults';
import { MapViewController } from './MapViewController';
import { MapLatLngInputs } from './MapLatLngInputs';
import { Button } from '../ui/Button';

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

function FitAllBounds({
  features,
  enabled,
}: {
  features: PolygonFeature[];
  enabled: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
    const b = L.latLngBounds([]);
    features.forEach((f) => {
      const layer = L.geoJSON(f as GeoJSON.GeoJSON);
      const lb = layer.getBounds();
      if (lb.isValid()) b.extend(lb);
    });
    if (b.isValid()) {
      map.fitBounds(b, { padding: [40, 40], maxZoom: 16 });
    }
  }, [map, features, enabled]);
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

  const [fitPolygons, setFitPolygons] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);

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
      <MapLatLngInputs
        className="mb-2"
        onApply={(center, zoom) => {
          setMapCenter(center);
          setMapZoom(zoom);
          setFitPolygons(false);
        }}
      />
      <div className="flex justify-end mb-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setFitPolygons(true)}>
          Fit to polygons
        </Button>
      </div>
      <div className="h-[420px] w-full rounded-lg border border-gray-200 overflow-hidden z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer attribution={OSM_ATTRIBUTION} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {fitPolygons ? (
            <FitAllBounds features={allFeatures} enabled={fitPolygons} />
          ) : (
            <MapViewController center={mapCenter} zoom={mapZoom} />
          )}
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
