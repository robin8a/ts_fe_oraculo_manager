import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import type { PolygonFeature } from '../../types/topology';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from './mapDefaults';
import { MapViewController } from './MapViewController';
import { MapLatLngInputs } from './MapLatLngInputs';

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

type DrawEvt = L.LeafletEvent & {
  layers?: L.LayerGroup;
  layer?: L.Layer;
};

function syncPolygonFromFeatureGroup(fg: L.FeatureGroup): PolygonFeature | null {
  const layers = fg.getLayers();
  if (layers.length === 0) return null;
  const layer = layers[0] as L.Layer & { toGeoJSON: () => GeoJSON.GeoJSON };
  const gj = layer.toGeoJSON();
  if (gj.type === 'Feature' && gj.geometry && (gj.geometry.type === 'Polygon' || gj.geometry.type === 'MultiPolygon')) {
    return gj as PolygonFeature;
  }
  return null;
}

function loadIntoGroup(fg: L.FeatureGroup, feature: PolygonFeature, map: L.Map) {
  fg.clearLayers();
  const gj = L.geoJSON(feature as GeoJSON.GeoJSON);
  gj.eachLayer((ly) => fg.addLayer(ly));
  const b = fg.getBounds();
  if (b.isValid()) {
    map.fitBounds(b, { padding: [32, 32], maxZoom: 16 });
  }
}

function DrawToolbarBridge({
  value,
  onChange,
}: {
  value: PolygonFeature | null;
  onChange: (next: PolygonFeature | null) => void;
}) {
  const map = useMap();
  const fgRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const sync = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    onChangeRef.current(syncPolygonFromFeatureGroup(fg));
  }, []);

  useEffect(() => {
    const fg = new L.FeatureGroup();
    fgRef.current = fg;
    map.addLayer(fg);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          // Leaflet.draw rejects many valid 4th+ clicks when false: the new edge from the
          // last vertex is tested against the first segment and often crosses it in screen
          // space even for simple parcels. Allow drawing; avoid self-crossing shapes.
          allowIntersection: true,
          showArea: true,
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: fg,
        remove: true,
      },
    });
    drawControlRef.current = drawControl;
    map.addControl(drawControl);

    const onCreated = (e: DrawEvt) => {
      if (e.layer) {
        fg.clearLayers();
        fg.addLayer(e.layer);
        sync();
      }
    };

    const onEditedOrDeleted = () => {
      sync();
    };

    map.on(L.Draw.Event.CREATED, onCreated as L.LeafletEventHandlerFn);
    map.on(L.Draw.Event.EDITED, onEditedOrDeleted);
    map.on(L.Draw.Event.DELETED, onEditedOrDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated as L.LeafletEventHandlerFn);
      map.off(L.Draw.Event.EDITED, onEditedOrDeleted);
      map.off(L.Draw.Event.DELETED, onEditedOrDeleted);
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      map.removeLayer(fg);
      fgRef.current = null;
    };
  }, [map, sync]);

  const lastLoadedRef = useRef<string | null>(null);
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const key = value ? JSON.stringify(value) : '';
    if (key === lastLoadedRef.current) return;
    lastLoadedRef.current = key;
    if (value) {
      loadIntoGroup(fg, value, map);
    } else {
      fg.clearLayers();
    }
  }, [value, map]);

  return null;
}

/** When the selected parent changes, fit the map to parent + current draft polygon (if any). */
function FitWhenParentSelectionChanges({
  parentFeature,
  userFeature,
}: {
  parentFeature: PolygonFeature | null;
  userFeature: PolygonFeature | null;
}) {
  const map = useMap();
  const lastParentKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const parentKey = parentFeature ? JSON.stringify(parentFeature) : '';
    if (parentKey === lastParentKeyRef.current) return;
    lastParentKeyRef.current = parentKey;

    const b = L.latLngBounds([]);
    if (parentFeature) {
      const pb = L.geoJSON(parentFeature as GeoJSON.GeoJSON).getBounds();
      if (pb.isValid()) b.extend(pb);
    }
    if (userFeature) {
      const ub = L.geoJSON(userFeature as GeoJSON.GeoJSON).getBounds();
      if (ub.isValid()) b.extend(ub);
    }
    if (b.isValid()) {
      map.fitBounds(b, { padding: [28, 28], maxZoom: 16 });
    }
  }, [map, parentFeature, userFeature]);

  return null;
}

const PARENT_PREVIEW_STYLE = {
  color: '#2563eb',
  weight: 2,
  opacity: 0.9,
  fillColor: '#2563eb',
  fillOpacity: 0.12,
  dashArray: '8 6' as const,
};

export interface TopologyPolygonEditorProps {
  value: PolygonFeature | null;
  onChange: (next: PolygonFeature | null) => void;
  /** Selected parent topology polygon (read-only preview). */
  parentPreviewFeature?: PolygonFeature | null;
  className?: string;
}

export const TopologyPolygonEditor: React.FC<TopologyPolygonEditorProps> = ({
  value,
  onChange,
  parentPreviewFeature = null,
  className,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);

  return (
    <div className={className ?? ''}>
      <p className="text-sm text-gray-600 mb-2">
        Use the polygon tool to draw an area (any number of corners). Close by clicking the first point or
        double‑clicking the last. Drag vertices to edit, or remove the shape from the toolbar.
        {parentPreviewFeature && (
          <span className="block mt-1 text-gray-500">
            Blue dashed outline: parent topology area (reference only).
          </span>
        )}
      </p>
      <MapLatLngInputs
        className="mb-3"
        onApply={(center, zoom) => {
          setMapCenter(center);
          setMapZoom(zoom);
        }}
      />
      <div className="h-[420px] w-full rounded-lg border border-gray-200 overflow-hidden z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer attribution={OSM_ATTRIBUTION} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapViewController center={mapCenter} zoom={mapZoom} />
          {parentPreviewFeature && (
            <GeoJSON
              key={JSON.stringify(parentPreviewFeature)}
              data={parentPreviewFeature as GeoJSON.GeoJSON}
              style={PARENT_PREVIEW_STYLE}
            />
          )}
          <FitWhenParentSelectionChanges parentFeature={parentPreviewFeature} userFeature={value} />
          <DrawToolbarBridge value={value} onChange={onChange} />
        </MapContainer>
      </div>
    </div>
  );
};
