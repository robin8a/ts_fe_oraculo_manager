import type { KoboToolboxConfig, KoboToolboxRow } from '../types/koboToolbox';

/**
 * Fetch data from KoboToolbox API
 */
export async function fetchData(
  serverUrl: string,
  apiKey: string,
  projectUid: string,
  format: 'json' | 'csv'
): Promise<KoboToolboxRow[]> {
  const baseUrl = serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`;
  const url = `${baseUrl}/api/v2/assets/${projectUid}/data.${format}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your credentials.');
      }
      if (response.status === 404) {
        throw new Error('Project not found. Please check the project UID.');
      }
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    if (format === 'json') {
      const data = await response.json();
      // KoboToolbox JSON format returns results array
      return Array.isArray(data) ? data : data.results || [];
    } else {
      // CSV format
      const csvText = await response.text();
      return parseCSV(csvText);
    }
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Network error: ${error.message || 'Failed to connect to KoboToolbox'}`);
  }
}

/**
 * Download audio file from KoboToolbox
 */
export async function downloadAudioFile(
  downloadUrl: string,
  apiKey: string
): Promise<Blob> {
  try {
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download audio file: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error: any) {
    throw new Error(`Error downloading audio file: ${error.message}`);
  }
}

/**
 * Parse CSV text into array of objects
 */
function parseCSV(csvText: string): KoboToolboxRow[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Parse rows
  const rows: KoboToolboxRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row: KoboToolboxRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values.map(v => v.replace(/^"|"$/g, ''));
}

/**
 * Check if a column contains audio data
 */
export function isAudioColumn(columnName: string, value: any): boolean {
  if (!value || typeof value !== 'string') return false;
  
  const lowerName = columnName.toLowerCase();
  const lowerValue = value.toLowerCase();
  
  // Check column name
  if (lowerName.includes('audio') || lowerName.includes('sound') || lowerName.includes('recording')) {
    return true;
  }
  
  // Check if value is a URL pointing to audio
  if (value.startsWith('http') && (
    lowerValue.includes('.mp3') ||
    lowerValue.includes('.wav') ||
    lowerValue.includes('.ogg') ||
    lowerValue.includes('.m4a') ||
    lowerValue.includes('audio') ||
    lowerValue.includes('attachment')
  )) {
    return true;
  }
  
  return false;
}

