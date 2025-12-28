import { API } from 'aws-amplify';
import type { KoboToolboxRow } from '../types/koboToolbox';

/**
 * Fetch data from KoboToolbox API
 * Tries Lambda proxy first, falls back to direct request (will fail due to CORS)
 */
export async function fetchData(
  serverUrl: string,
  apiKey: string,
  projectUid: string,
  format: 'json' | 'csv'
): Promise<KoboToolboxRow[]> {
  // Try Lambda function first (if deployed)
  try {
    const response = await API.post('kobotoolboxProxy', '/', {
      body: {
        serverUrl,
        apiKey,
        projectUid,
        format,
      },
    });

    console.log('Lambda response:', response);

    // Check if response has error
    if (response.error) {
      throw new Error(response.error);
    }

    // Lambda returns the body directly or wrapped
    let responseBody = response;
    if (response.body) {
      responseBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    } else if (typeof response === 'string') {
      try {
        responseBody = JSON.parse(response);
      } catch {
        // If not JSON, treat as text (CSV)
        responseBody = response;
      }
    }

    // Handle response based on format
    if (format === 'json') {
      const data = Array.isArray(responseBody) ? responseBody : responseBody.results || responseBody;
      return Array.isArray(data) ? data : [];
    } else {
      // CSV format
      const csvText = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody);
      return parseCSV(csvText);
    }
  } catch (lambdaError: any) {
    console.error('Lambda proxy error:', lambdaError);
    
    // If Lambda function is not available, try direct request
    if (lambdaError.message && (
      lambdaError.message.includes('kobotoolboxProxy') ||
      lambdaError.message.includes('not found') ||
      lambdaError.message.includes('does not exist') ||
      lambdaError.code === 'NotFound' ||
      lambdaError.code === 'ResourceNotFoundException'
    )) {
      console.warn('Lambda proxy not available, trying direct request (may fail due to CORS)');
      return fetchDataDirect(serverUrl, apiKey, projectUid, format);
    }
    // If it's a different error from Lambda, throw it with more context
    throw new Error(`Lambda proxy error: ${lambdaError.message || JSON.stringify(lambdaError)}`);
  }
}

/**
 * Direct fetch (fallback - will fail due to CORS in browser)
 */
async function fetchDataDirect(
  serverUrl: string,
  apiKey: string,
  projectUid: string,
  format: 'json' | 'csv'
): Promise<KoboToolboxRow[]> {
  const baseUrl = serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`;
  const targetUrl = `${baseUrl}/api/v2/assets/${projectUid}/data.${format}`;

  try {
    const response = await fetch(targetUrl, {
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
      return Array.isArray(data) ? data : data.results || [];
    } else {
      const csvText = await response.text();
      return parseCSV(csvText);
    }
  } catch (error: any) {
    // Check if it's a CORS error
    if (error.message && (
      error.message.includes('CORS') || 
      error.message.includes('Access-Control-Allow-Origin') ||
      error.message.includes('not allowed by Access-Control-Allow-Headers') ||
      error.name === 'TypeError' ||
      error.message.includes('Failed to fetch')
    )) {
      throw new Error(
        'CORS Error: KoboToolbox API blocks direct browser requests.\n\n' +
        'REQUIRED: Deploy the Lambda proxy function:\n\n' +
        '1. Run: amplify push\n' +
        '2. Wait for deployment\n' +
        '3. Try again\n\n' +
        'OR use a CORS browser extension for development testing.'
      );
    }
    throw error;
  }
}

/**
 * Download audio file from KoboToolbox
 * Tries Lambda proxy first, falls back to direct request
 */
export async function downloadAudioFile(
  downloadUrl: string,
  apiKey: string
): Promise<Blob> {
  // Try Lambda function first (if deployed)
  try {
    const response = await API.post('kobotoolboxProxy', '/', {
      body: {
        downloadUrl,
        apiKey,
      },
    });

    // Convert base64 response to Blob
    if (response.isBase64Encoded && response.body) {
      const binaryString = atob(response.body);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'audio/mpeg' });
    }

    // Fallback: try direct fetch
    return downloadAudioFileDirect(downloadUrl, apiKey);
  } catch (lambdaError: any) {
    // If Lambda function is not available, try direct request
    if (lambdaError.message && (
      lambdaError.message.includes('kobotoolboxProxy') ||
      lambdaError.message.includes('not found') ||
      lambdaError.code === 'NotFound'
    )) {
      console.warn('Lambda proxy not available, trying direct request (may fail due to CORS)');
      return downloadAudioFileDirect(downloadUrl, apiKey);
    }
    throw new Error(`Error downloading audio file: ${lambdaError.message}`);
  }
}

/**
 * Direct download (fallback - will fail due to CORS in browser)
 */
async function downloadAudioFileDirect(
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
    if (error.message && (
      error.message.includes('CORS') || 
      error.message.includes('Access-Control-Allow-Origin') ||
      error.message.includes('not allowed by Access-Control-Allow-Headers') ||
      error.name === 'TypeError' ||
      error.message.includes('Failed to fetch')
    )) {
      throw new Error(
        'CORS Error: Cannot download audio file directly from browser.\n\n' +
        'Please deploy the Lambda proxy function:\n' +
        '1. Run: amplify push\n' +
        '2. Wait for deployment\n' +
        '3. Try again\n\n' +
        'OR use a CORS browser extension for development testing.'
      );
    }
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

