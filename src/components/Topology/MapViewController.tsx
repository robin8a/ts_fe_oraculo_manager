import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/** Pans/zooms the map when center or zoom change (e.g. after user applies lat/lng). */
export function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center[0], center[1], zoom]);
  return null;
}
