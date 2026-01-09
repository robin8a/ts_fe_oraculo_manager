import { useState, useCallback } from 'react';
import { processAudioToFeatures, type ProcessAudioToFeaturesParams, type ProcessAudioToFeaturesResponse } from '../services/audioToFeaturesService';

export interface UseAudioToFeaturesResult {
  processAudio: (params: ProcessAudioToFeaturesParams) => Promise<ProcessAudioToFeaturesResponse | null>;
  loading: boolean;
  error: string | null;
  result: ProcessAudioToFeaturesResponse | null;
}

export function useAudioToFeatures(): UseAudioToFeaturesResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessAudioToFeaturesResponse | null>(null);

  const processAudio = useCallback(async (params: ProcessAudioToFeaturesParams) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await processAudioToFeatures(params);
      setResult(response);
      return response;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to process audio to features';
      setError(errorMessage);
      console.error('Error processing audio to features:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { processAudio, loading, error, result };
}
