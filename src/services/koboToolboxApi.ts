import type { KoboToolboxRow } from '../types/koboToolbox';

// Lambda Function URL for KoboToolbox proxy
// Can be overridden via environment variable VITE_KOBOTOOLBOX_PROXY_URL
// Remove trailing slash if present
const getFunctionUrl = () => {
  const url = import.meta.env.VITE_KOBOTOOLBOX_PROXY_URL || 
    'https://ah5rtowwsvsmrnosm7rgjrejjm0redcf.lambda-url.us-east-1.on.aws/';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const LAMBDA_FUNCTION_URL = getFunctionUrl();

/**
 * Fetch data from KoboToolbox API via Lambda Function URL
 */
export async function fetchData(
  serverUrl: string,
  apiKey: string,
  projectUid: string,
  format: 'json' | 'csv'
): Promise<KoboToolboxRow[]> {
  try {
    console.log('Calling Lambda Function URL:', LAMBDA_FUNCTION_URL);
    console.log('Request payload:', { serverUrl, projectUid, format, apiKey: '***' });
    
    // Call Lambda Function URL directly
    // Note: Function URLs handle CORS automatically if configured in AWS
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors', // Explicitly request CORS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverUrl,
        apiKey,
        projectUid,
        format,
      }),
    });

    console.log('Lambda response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        console.error('Lambda error response:', errorText);
      } catch (e) {
        errorText = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(`Lambda function error: ${response.status} - ${errorText}`);
    }

    // Lambda Function URL returns the Lambda response directly
    // Lambda returns: { statusCode: 200, body: "...", headers: {...} }
    const lambdaResponse = await response.json();
    
    // Check if response has statusCode (Lambda format) or is direct data
    if (lambdaResponse.statusCode) {
      if (lambdaResponse.statusCode !== 200) {
        const errorBody = typeof lambdaResponse.body === 'string' 
          ? lambdaResponse.body 
          : JSON.stringify(lambdaResponse.body);
        throw new Error(errorBody || `Lambda returned status ${lambdaResponse.statusCode}`);
      }

      // Parse the body
      let responseBody: any;
      if (typeof lambdaResponse.body === 'string') {
        try {
          responseBody = JSON.parse(lambdaResponse.body);
        } catch {
          responseBody = lambdaResponse.body; // Keep as string for CSV
        }
      } else {
        responseBody = lambdaResponse.body;
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
    } else {
      // Direct response (Function URL might unwrap it)
      if (format === 'json') {
        const data = Array.isArray(lambdaResponse) ? lambdaResponse : lambdaResponse.results || lambdaResponse;
        return Array.isArray(data) ? data : [];
      } else {
        const csvText = typeof lambdaResponse === 'string' ? lambdaResponse : JSON.stringify(lambdaResponse);
        return parseCSV(csvText);
      }
    }

  } catch (error: any) {
    console.error('Lambda proxy error:', error);
    
    // Check for network/CORS errors
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(
        `Network error: Cannot reach Lambda Function URL.\n\n` +
        `Please verify:\n` +
        `1. Lambda Function URL is correct: ${LAMBDA_FUNCTION_URL}\n` +
        `2. Function URL is enabled and accessible\n` +
        `3. No CORS restrictions are blocking the request\n\n` +
        `Original error: ${error.message}`
      );
    }
    
    throw new Error(`Failed to fetch data via Lambda: ${error.message}`);
  }
}


/**
 * Download audio file from KoboToolbox via Lambda Function URL
 */
export async function downloadAudioFile(
  downloadUrl: string,
  apiKey: string,
  serverUrl?: string
): Promise<Blob> {
  try {
    // Validate URL before sending
    if (!downloadUrl || typeof downloadUrl !== 'string') {
      throw new Error('Invalid downloadUrl: must be a non-empty string');
    }

    // Ensure we have a full URL
    let fullUrl = downloadUrl;
    if (!downloadUrl.startsWith('http://') && !downloadUrl.startsWith('https://')) {
      // Construct full URL if it's relative
      const baseUrl = serverUrl 
        ? (serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`)
        : 'https://kf.kobotoolbox.org';
      fullUrl = downloadUrl.startsWith('/') 
        ? `${baseUrl}${downloadUrl}`
        : `${baseUrl}/${downloadUrl}`;
    }

    console.log('Downloading audio from URL:', fullUrl);

    // Call Lambda Function URL directly
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        downloadUrl: fullUrl,
        apiKey,
        serverUrl: serverUrl || 'kf.kobotoolbox.org', // Pass serverUrl for URL construction fallback
      }),
    });

    // Check content type to determine response format
    const contentType = response.headers.get('content-type') || '';
    console.log('Lambda response content-type:', contentType);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lambda function error: ${response.status} - ${errorText}`);
    }

    // Lambda Function URL may return:
    // 1. Binary audio directly (if Function URL auto-decodes base64)
    // 2. JSON with base64-encoded body: { statusCode: 200, body: "base64...", isBase64Encoded: true }
    
    // Check if response is binary audio
    if (contentType.includes('audio/') || contentType.includes('application/octet-stream') || 
        contentType.includes('video/')) {
      console.log('Received binary audio data directly from Function URL');
      const audioBlob = await response.blob();
      return audioBlob;
    }

    // Otherwise, try to parse as JSON
    const responseText = await response.text();
    console.log('Lambda response text (first 200 chars):', responseText.substring(0, 200));
    
    // Check if it's actually binary data (starts with binary bytes, not JSON)
    if (responseText.length > 0 && (responseText.charCodeAt(0) < 32 || responseText.startsWith('ftyp'))) {
      console.log('Response appears to be binary data (not JSON), converting to Blob');
      const binaryString = responseText;
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      let mimeType = 'audio/mpeg';
      const urlLower = downloadUrl.toLowerCase();
      if (urlLower.includes('.m4a')) mimeType = 'audio/mp4';
      else if (urlLower.includes('.wav')) mimeType = 'audio/wav';
      else if (urlLower.includes('.ogg')) mimeType = 'audio/ogg';
      else if (urlLower.includes('.mp3')) mimeType = 'audio/mpeg';
      return new Blob([bytes], { type: mimeType });
    }
    
    let lambdaResponse: any;
    try {
      lambdaResponse = JSON.parse(responseText);
    } catch (jsonError: any) {
      // If not JSON and not binary, it might be an error message
      if (responseText.includes('error') || responseText.includes('Error')) {
        throw new Error(`Lambda returned error: ${responseText}`);
      }
      throw new Error(`Failed to parse Lambda response as JSON: ${jsonError.message}`);
    }
    
    // Check if response has statusCode (Lambda format)
    if (lambdaResponse.statusCode) {
      if (lambdaResponse.statusCode !== 200) {
        const errorBody = typeof lambdaResponse.body === 'string' 
          ? lambdaResponse.body 
          : JSON.stringify(lambdaResponse.body);
        throw new Error(errorBody || `Lambda returned status ${lambdaResponse.statusCode}`);
      }

      // Convert base64 response to Blob
      if (lambdaResponse.body) {
        try {
          const binaryString = atob(lambdaResponse.body);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Determine MIME type from download URL
          let mimeType = 'audio/mpeg'; // default
          const urlLower = downloadUrl.toLowerCase();
          if (urlLower.includes('.m4a')) {
            mimeType = 'audio/mp4';
          } else if (urlLower.includes('.wav')) {
            mimeType = 'audio/wav';
          } else if (urlLower.includes('.ogg')) {
            mimeType = 'audio/ogg';
          } else if (urlLower.includes('.mp3')) {
            mimeType = 'audio/mpeg';
          }
          
          console.log(`Creating Blob with MIME type: ${mimeType}, size: ${bytes.length} bytes`);
          return new Blob([bytes], { type: mimeType });
        } catch (base64Error: any) {
          throw new Error(`Failed to decode base64 audio data: ${base64Error.message}`);
        }
      }

      throw new Error('No audio data in Lambda response');
    } else {
      // Direct response (shouldn't happen for binary, but handle it)
      throw new Error('Unexpected response format from Lambda');
    }
  } catch (error: any) {
    console.error('Lambda proxy error downloading audio:', error);
    throw new Error(`Failed to download audio via Lambda: ${error.message}`);
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

