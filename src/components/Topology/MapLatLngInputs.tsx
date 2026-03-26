import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_CENTER_HINT,
  DEFAULT_MAP_ZOOM,
  MANUAL_VIEW_ZOOM,
  parseLatLngLine,
} from './mapDefaults';

export interface MapLatLngInputsProps {
  /** Called when user applies a valid center + zoom. */
  onApply: (center: [number, number], zoom: number) => void;
  /** Optional label for the combined paste row. */
  className?: string;
}

export const MapLatLngInputs: React.FC<MapLatLngInputsProps> = ({ onApply, className }) => {
  const [lat, setLat] = useState(String(DEFAULT_MAP_CENTER[0]));
  const [lng, setLng] = useState(String(DEFAULT_MAP_CENTER[1]));
  const [zoomStr, setZoomStr] = useState(String(MANUAL_VIEW_ZOOM));
  const [pasteLine, setPasteLine] = useState('');
  const [error, setError] = useState<string | null>(null);

  const applyFromFields = () => {
    setError(null);
    const la = Number(lat.trim());
    const ln = Number(lng.trim());
    const z = Number(zoomStr.trim());
    if (!Number.isFinite(la) || !Number.isFinite(ln) || !Number.isFinite(z)) {
      setError('Latitude, longitude, and zoom must be valid numbers.');
      return;
    }
    if (la < -90 || la > 90 || ln < -180 || ln > 180) {
      setError('Latitude must be −90…90 and longitude −180…180.');
      return;
    }
    if (z < 1 || z > 22) {
      setError('Zoom must be between 1 and 22.');
      return;
    }
    onApply([la, ln], Math.round(z));
  };

  const applyFromPaste = () => {
    setError(null);
    const parsed = parseLatLngLine(pasteLine);
    if (!parsed) {
      setError(`Use the format: ${DEFAULT_MAP_CENTER_HINT} (latitude, then longitude, space-separated).`);
      return;
    }
    setLat(String(parsed.lat));
    setLng(String(parsed.lng));
    const z = Number(zoomStr.trim());
    const zoom =
      Number.isFinite(z) && z >= 1 && z <= 22 ? Math.round(z) : MANUAL_VIEW_ZOOM;
    if (!(Number.isFinite(z) && z >= 1 && z <= 22)) {
      setZoomStr(String(MANUAL_VIEW_ZOOM));
    }
    onApply([parsed.lat, parsed.lng], zoom);
  };

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[120px]">
          <Input
            label="Latitude"
            type="text"
            inputMode="decimal"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="4.0042567"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <Input
            label="Longitude"
            type="text"
            inputMode="decimal"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="-72.9361367"
          />
        </div>
        <div className="w-full sm:w-24">
          <Input
            label="Zoom"
            type="text"
            inputMode="numeric"
            value={zoomStr}
            onChange={(e) => setZoomStr(e.target.value)}
            placeholder={String(DEFAULT_MAP_ZOOM)}
          />
        </div>
        <Button type="button" variant="primary" onClick={applyFromFields} className="w-full sm:w-auto">
          Go to location
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <Input
            label={`Or paste lat & lng (example: ${DEFAULT_MAP_CENTER_HINT})`}
            type="text"
            value={pasteLine}
            onChange={(e) => setPasteLine(e.target.value)}
            placeholder={DEFAULT_MAP_CENTER_HINT}
          />
        </div>
        <Button type="button" variant="outline" onClick={applyFromPaste} className="w-full sm:w-auto shrink-0">
          Parse & zoom
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
