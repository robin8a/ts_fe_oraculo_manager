/**
 * Default map view when no polygon bounds are available.
 * Format hint for users: "latitude longitude" (space-separated), e.g. "4.0042567 -72.9361367"
 */
export const DEFAULT_MAP_CENTER: [number, number] = [4.0042567, -72.9361367];

export const DEFAULT_MAP_CENTER_HINT = '4.0042567 -72.9361367';

/** Zoom level for the default center (local area). */
export const DEFAULT_MAP_ZOOM = 8;

/** Zoom used when applying a manual lat/lng (clear view of the area). */
export const MANUAL_VIEW_ZOOM = 12;

/**
 * Parse a single line like "4.0042567 -72.9361367" (latitude, then longitude, whitespace-separated).
 */
export function parseLatLngLine(input: string): { lat: number; lng: number } | null {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}
