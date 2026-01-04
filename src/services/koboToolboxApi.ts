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
 * Test Function URL connectivity (for debugging)
 * Call this from browser console: window.testKoboToolboxProxy()
 */
if (typeof window !== 'undefined') {
  (window as any).testKoboToolboxProxy = async () => {
    console.log('Testing Lambda Function URL:', LAMBDA_FUNCTION_URL);
    try {
      const response = await fetch(LAMBDA_FUNCTION_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'connectivity' }),
      });
      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response body:', text);
      return { success: true, status: response.status, body: text };
    } catch (error: any) {
      console.error('Test failed:', error);
      return { success: false, error: error.message };
    }
  };
}

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
    console.log('Making request to:', LAMBDA_FUNCTION_URL);
    
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors', // Explicitly request CORS
      credentials: 'omit', // Don't send cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        serverUrl,
        apiKey,
        projectUid,
        format,
      }),
    }).catch((fetchError: any) => {
      console.error('Fetch error details:', {
        message: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack,
      });
      throw new Error(
        `Network error: Cannot reach Lambda Function URL.\n\n` +
        `Error: ${fetchError.message}\n\n` +
        `Please verify:\n` +
        `1. Lambda Function URL is correct: ${LAMBDA_FUNCTION_URL}\n` +
        `2. Function URL is enabled and accessible\n` +
        `3. CORS is configured in AWS Lambda Console\n` +
        `4. No browser extensions are blocking the request\n\n` +
        `To enable CORS, run:\n` +
        `aws lambda update-function-url-config --function-name kobotoolboxProxy-dev --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type","Authorization","X-Requested-With"],"MaxAge":86400}'`
      );
    });

    console.log('Lambda response status:', response.status, response.statusText);
    console.log('Lambda response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        console.error('Lambda error response (first 500 chars):', errorText.substring(0, 500));
        
        // Check if it's HTML (404 page) instead of JSON error
        if (errorText.includes('<!doctype html>') || errorText.includes('<html>')) {
          throw new Error(
            `Lambda Function URL returned HTML (404). This usually means:\n` +
            `1. The Lambda function is not deployed or not accessible\n` +
            `2. The Function URL is pointing to the wrong function\n` +
            `3. The Function URL configuration is incorrect\n\n` +
            `Please verify the Function URL in AWS Lambda Console.`
          );
        }
      } catch (e: any) {
        if (e.message && e.message.includes('Lambda Function URL returned HTML')) {
          throw e;
        }
        errorText = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(`Lambda function error: ${response.status} - ${errorText.substring(0, 200)}`);
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
    console.log('Lambda response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lambda function error: ${response.status} - ${errorText}`);
    }

    // Lambda Function URL with isBase64Encoded: true auto-decodes base64 and returns binary directly
    // So we should get binary audio data, not JSON with base64
    
    // Check if response is binary audio (most common case with Function URLs)
    if (contentType.includes('audio/') || contentType.includes('application/octet-stream') || 
        contentType.includes('video/') || contentType.includes('binary')) {
      console.log('Received binary audio data directly from Function URL (auto-decoded)');
      const audioBlob = await response.blob();
      
      // Determine MIME type from download URL if not set correctly
      if (!audioBlob.type || audioBlob.type === 'application/octet-stream') {
        const urlLower = downloadUrl.toLowerCase();
        let mimeType = 'audio/mp4'; // Default to m4a/mp4 for KoboToolbox
        if (urlLower.includes('.m4a') || urlLower.includes('m4a')) {
          mimeType = 'audio/mp4';
        } else if (urlLower.includes('.mp3')) {
          mimeType = 'audio/mpeg';
        } else if (urlLower.includes('.wav')) {
          mimeType = 'audio/wav';
        } else if (urlLower.includes('.ogg')) {
          mimeType = 'audio/ogg';
        } else if (urlLower.includes('.aac')) {
          mimeType = 'audio/aac';
        }
        // Create new Blob with correct MIME type
        return new Blob([audioBlob], { type: mimeType });
      }
      
      console.log(`Audio Blob: size=${audioBlob.size}, type=${audioBlob.type}`);
      return audioBlob;
    }

    // Fallback: Try to get as ArrayBuffer first (for binary data)
    try {
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        // Check if it looks like binary audio (not JSON)
        const firstBytes = new Uint8Array(arrayBuffer.slice(0, 4));
        const isLikelyBinary = firstBytes[0] !== 0x7B; // Not '{' (JSON start)
        
        if (isLikelyBinary) {
          console.log('Response appears to be binary data (ArrayBuffer)');
          // Determine MIME type from download URL
          let mimeType = 'audio/mp4'; // Default to m4a
          const urlLower = downloadUrl.toLowerCase();
          if (urlLower.includes('.m4a') || urlLower.includes('m4a')) {
            mimeType = 'audio/mp4';
          } else if (urlLower.includes('.mp3')) {
            mimeType = 'audio/mpeg';
          } else if (urlLower.includes('.wav')) {
            mimeType = 'audio/wav';
          } else if (urlLower.includes('.ogg')) {
            mimeType = 'audio/ogg';
          } else if (urlLower.includes('.aac')) {
            mimeType = 'audio/aac';
          }
          
          console.log(`Creating Blob from ArrayBuffer: size=${arrayBuffer.byteLength}, type=${mimeType}`);
          return new Blob([arrayBuffer], { type: mimeType });
        }
      }
    } catch (arrayBufferError) {
      console.log('Failed to get as ArrayBuffer, trying text:', arrayBufferError);
    }

    // Last resort: Try to parse as JSON (for API Gateway format with base64)
    const responseText = await response.text();
    console.log('Lambda response text (first 200 chars):', responseText.substring(0, 200));
    
    // Check if it's actually binary data disguised as text
    if (responseText.length > 0 && (responseText.charCodeAt(0) < 32 || responseText.startsWith('ftyp'))) {
      console.log('Response appears to be binary data (text format), converting to Blob');
      const bytes = new Uint8Array(responseText.length);
      for (let i = 0; i < responseText.length; i++) {
        bytes[i] = responseText.charCodeAt(i);
      }
      let mimeType = 'audio/mp4'; // Default to m4a
      const urlLower = downloadUrl.toLowerCase();
      if (urlLower.includes('.m4a') || urlLower.includes('m4a')) {
        mimeType = 'audio/mp4';
      } else if (urlLower.includes('.mp3')) {
        mimeType = 'audio/mpeg';
      } else if (urlLower.includes('.wav')) {
        mimeType = 'audio/wav';
      } else if (urlLower.includes('.ogg')) {
        mimeType = 'audio/ogg';
      } else if (urlLower.includes('.aac')) {
        mimeType = 'audio/aac';
      }
      return new Blob([bytes], { type: mimeType });
    }
    
    // Try to parse as JSON (for API Gateway format)
    let lambdaResponse: any;
    try {
      lambdaResponse = JSON.parse(responseText);
    } catch (jsonError: any) {
      // If not JSON and not binary, it might be an error message
      if (responseText.includes('error') || responseText.includes('Error')) {
        throw new Error(`Lambda returned error: ${responseText}`);
      }
      throw new Error(`Failed to parse Lambda response: ${jsonError.message}`);
    }
    
    // Check if response has statusCode (Lambda format)
    if (lambdaResponse.statusCode) {
      if (lambdaResponse.statusCode !== 200) {
        const errorBody = typeof lambdaResponse.body === 'string' 
          ? lambdaResponse.body 
          : JSON.stringify(lambdaResponse.body);
        throw new Error(errorBody || `Lambda returned status ${lambdaResponse.statusCode}`);
      }

      // Convert base64 response to Blob (for API Gateway format)
      if (lambdaResponse.body) {
        try {
          const binaryString = atob(lambdaResponse.body);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Determine MIME type from download URL
          let mimeType = 'audio/mp4'; // Default to m4a
          const urlLower = downloadUrl.toLowerCase();
          if (urlLower.includes('.m4a') || urlLower.includes('m4a')) {
            mimeType = 'audio/mp4';
          } else if (urlLower.includes('.mp3')) {
            mimeType = 'audio/mpeg';
          } else if (urlLower.includes('.wav')) {
            mimeType = 'audio/wav';
          } else if (urlLower.includes('.ogg')) {
            mimeType = 'audio/ogg';
          } else if (urlLower.includes('.aac')) {
            mimeType = 'audio/aac';
          }
          
          console.log(`Creating Blob from base64: size=${bytes.length}, type=${mimeType}`);
          return new Blob([bytes], { type: mimeType });
        } catch (base64Error: any) {
          throw new Error(`Failed to decode base64 audio data: ${base64Error.message}`);
        }
      }

      throw new Error('No audio data in Lambda response body');
    } else {
      // Direct response (shouldn't happen for binary, but handle it)
      throw new Error('Unexpected response format from Lambda Function URL');
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

