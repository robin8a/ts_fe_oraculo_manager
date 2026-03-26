import React, { useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import type { PolygonFeature } from '../../types/topology';

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
          allowIntersection: false,
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

export interface TopologyPolygonEditorProps {
  value: PolygonFeature | null;
  onChange: (next: PolygonFeature | null) => void;
  className?: string;
}

export const TopologyPolygonEditor: React.FC<TopologyPolygonEditorProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={className ?? ''}>
      <p className="text-sm text-gray-600 mb-2">
        Use the polygon tool to draw an area. Drag vertices to edit, or remove the shape from the toolbar.
      </p>
      <div className="h-[420px] w-full rounded-lg border border-gray-200 overflow-hidden z-0">
        <MapContainer
          center={[4.65, -74.05]}
          zoom={6}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer attribution={OSM_ATTRIBUTION} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <DrawToolbarBridge value={value} onChange={onChange} />
        </MapContainer>
      </div>
    </div>
  );
};
