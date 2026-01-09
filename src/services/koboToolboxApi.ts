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
 * Get the current Lambda Function URL (for debugging/external use)
 */
export function getKoboToolboxProxyUrl(): string {
  return LAMBDA_FUNCTION_URL;
}

/**
 * Validate that the Function URL is configured
 */
function validateFunctionUrl(): void {
  if (!LAMBDA_FUNCTION_URL || LAMBDA_FUNCTION_URL.trim() === '') {
    console.error('❌ Lambda Function URL is not configured!');
    console.error('Please set VITE_KOBOTOOLBOX_PROXY_URL environment variable or update the default URL in koboToolboxApi.ts');
  } else if (!LAMBDA_FUNCTION_URL.startsWith('http://') && !LAMBDA_FUNCTION_URL.startsWith('https://')) {
    console.error('❌ Lambda Function URL is invalid:', LAMBDA_FUNCTION_URL);
    console.error('URL must start with http:// or https://');
  } else {
    console.log('✓ Lambda Function URL configured:', LAMBDA_FUNCTION_URL);
  }
}

// Validate on module load (only in browser)
if (typeof window !== 'undefined') {
  validateFunctionUrl();
}

/**
 * Test Function URL connectivity (for debugging)
 * Call this from browser console: window.testKoboToolboxProxy()
 */
if (typeof window !== 'undefined') {
  (window as any).testKoboToolboxProxy = async () => {
    console.log('Testing Lambda Function URL:', LAMBDA_FUNCTION_URL);
    const results: any = {
      functionUrl: LAMBDA_FUNCTION_URL,
      tests: [],
    };
    
    // Test 1: Basic connectivity
    try {
      console.log('Test 1: Basic connectivity test...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(LAMBDA_FUNCTION_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'connectivity' }),
      });
      clearTimeout(timeoutId);
      
      const text = await response.text();
      results.tests.push({
        name: 'Basic connectivity',
        success: true,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: text.substring(0, 200),
      });
      console.log('✓ Connectivity test passed:', response.status);
    } catch (error: any) {
      results.tests.push({
        name: 'Basic connectivity',
        success: false,
        error: error.message,
        errorType: error.name,
        isTimeout: error.name === 'AbortError',
        isCorsError: error.message.includes('CORS') || error.message.includes('fetch'),
      });
      console.error('✗ Connectivity test failed:', error);
    }
    
    // Test 2: OPTIONS preflight (CORS)
    try {
      console.log('Test 2: CORS preflight test...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(LAMBDA_FUNCTION_URL, {
        method: 'OPTIONS',
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });
      clearTimeout(timeoutId);
      
      results.tests.push({
        name: 'CORS preflight',
        success: true,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      });
      console.log('✓ CORS preflight test passed:', response.status);
    } catch (error: any) {
      results.tests.push({
        name: 'CORS preflight',
        success: false,
        error: error.message,
        errorType: error.name,
      });
      console.error('✗ CORS preflight test failed:', error);
    }
    
    // Test 3: Actual request with valid payload
    try {
      console.log('Test 3: Valid request test...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for actual request
      
      const response = await fetch(LAMBDA_FUNCTION_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          serverUrl: 'kf.kobotoolbox.org',
          apiKey: 'test-key',
          projectUid: 'test-project',
          format: 'json',
        }),
      });
      clearTimeout(timeoutId);
      
      const text = await response.text();
      results.tests.push({
        name: 'Valid request',
        success: response.ok,
        status: response.status,
        body: text.substring(0, 200),
      });
      console.log('✓ Valid request test completed:', response.status);
    } catch (error: any) {
      results.tests.push({
        name: 'Valid request',
        success: false,
        error: error.message,
        errorType: error.name,
      });
      console.error('✗ Valid request test failed:', error);
    }
    
    console.log('=== Test Results ===', results);
    return results;
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
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors', // Explicitly request CORS
      credentials: 'omit', // Don't send cookies
      signal: controller.signal, // Add timeout support
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
      clearTimeout(timeoutId);
      console.error('Fetch error details:', {
        message: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack,
        isTimeout: fetchError.name === 'AbortError',
        isNetworkError: fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError',
        isCorsError: fetchError.message.includes('CORS') || 
                     (fetchError.message === 'Failed to fetch' && typeof navigator !== 'undefined' && navigator.onLine),
      });
      
      // Provide more specific error messages
      let errorDetails = '';
      if (fetchError.name === 'AbortError') {
        errorDetails = 'Request timed out after 60 seconds. The Lambda function may be slow or unresponsive.';
      } else if (fetchError.message === 'Failed to fetch') {
        errorDetails = 'Network request failed. This could be due to:\n' +
          '- CORS not configured on the Lambda Function URL\n' +
          '- Function URL is disabled or deleted\n' +
          '- Network/firewall blocking the request\n' +
          '- Browser extension blocking CORS requests';
      } else {
        errorDetails = `Error: ${fetchError.message}`;
      }
      
      throw new Error(
        `Network error: Cannot reach Lambda Function URL.\n\n` +
        `${errorDetails}\n\n` +
        `Please verify:\n` +
        `1. Lambda Function URL is correct: ${LAMBDA_FUNCTION_URL}\n` +
        `2. Function URL is enabled and accessible in AWS Lambda Console\n` +
        `3. CORS is configured in AWS Lambda Console\n` +
        `4. No browser extensions are blocking the request\n\n` +
        `To enable CORS, run:\n` +
        `aws lambda update-function-url-config --function-name kobotoolboxProxy-dev --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type","Authorization","X-Requested-With"],"MaxAge":86400}'\n\n` +
        `To test the Function URL, open browser console and run: window.testKoboToolboxProxy()`
      );
    });
    
    clearTimeout(timeoutId);

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
    // Create AbortController for timeout (audio files may be large, so longer timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout for audio downloads
    
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        downloadUrl: fullUrl,
        apiKey,
        serverUrl: serverUrl || 'kf.kobotoolbox.org', // Pass serverUrl for URL construction fallback
      }),
    }).catch((fetchError: any) => {
      clearTimeout(timeoutId);
      console.error('Audio download fetch error:', {
        message: fetchError.message,
        name: fetchError.name,
        isTimeout: fetchError.name === 'AbortError',
        isNetworkError: fetchError.message === 'Failed to fetch',
      });
      
      let errorDetails = '';
      if (fetchError.name === 'AbortError') {
        errorDetails = 'Audio download timed out after 5 minutes. The file may be too large or the Lambda function may be slow.';
      } else if (fetchError.message === 'Failed to fetch') {
        errorDetails = 'Network request failed. Please verify:\n' +
          '- Lambda Function URL is enabled and accessible\n' +
          '- CORS is configured correctly\n' +
          '- Network/firewall is not blocking the request';
      } else {
        errorDetails = `Error: ${fetchError.message}`;
      }
      
      throw new Error(
        `Failed to download audio via Lambda Function URL.\n\n` +
        `${errorDetails}\n\n` +
        `Function URL: ${LAMBDA_FUNCTION_URL}\n` +
        `Audio URL: ${fullUrl}`
      );
    });
    
    clearTimeout(timeoutId);

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
    
    // Determine correct MIME type from download URL first
    const urlLower = downloadUrl.toLowerCase();
    let correctMimeType = 'audio/mp4'; // Default to m4a/mp4 for KoboToolbox
    let fileExtension = 'm4a';
    if (urlLower.includes('.mp3') || urlLower.includes('mp3')) {
      correctMimeType = 'audio/mpeg';
      fileExtension = 'mp3';
    } else if (urlLower.includes('.m4a') || urlLower.includes('m4a')) {
      correctMimeType = 'audio/mp4';
      fileExtension = 'm4a';
    } else if (urlLower.includes('.wav')) {
      correctMimeType = 'audio/wav';
      fileExtension = 'wav';
    } else if (urlLower.includes('.ogg')) {
      correctMimeType = 'audio/ogg';
      fileExtension = 'ogg';
    } else if (urlLower.includes('.aac')) {
      correctMimeType = 'audio/aac';
      fileExtension = 'aac';
    }
    
    console.log(`Expected audio format: ${fileExtension}, MIME: ${correctMimeType}`);
    
    // Check if response is binary audio (most common case with Function URLs)
    if (contentType.includes('audio/') || contentType.includes('application/octet-stream') || 
        contentType.includes('video/') || contentType.includes('binary')) {
      console.log('Received binary audio data directly from Function URL (auto-decoded)');
      
      // Get as ArrayBuffer first to ensure we have raw binary data
      const arrayBuffer = await response.arrayBuffer();
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Received empty audio file from Lambda');
      }
      
      console.log(`Audio ArrayBuffer: size=${arrayBuffer.byteLength} bytes`);
      
      // Create Blob with correct MIME type
      const audioBlob = new Blob([arrayBuffer], { type: correctMimeType });
      
      // Validate the blob
      if (audioBlob.size === 0) {
        throw new Error('Created empty audio Blob');
      }
      
      console.log(`Audio Blob created: size=${audioBlob.size}, type=${audioBlob.type}`);
      return audioBlob;
    }

    // Fallback: Try to get as ArrayBuffer (for binary data that wasn't detected by content-type)
    try {
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        // Check if it looks like binary audio (not JSON)
        const firstBytes = new Uint8Array(arrayBuffer.slice(0, 4));
        const isLikelyBinary = firstBytes[0] !== 0x7B; // Not '{' (JSON start)
        
        // Also check for common audio file signatures
        // MP3: FF FB or FF F3, M4A/MP4: 00 00 00 ?? 66 74 79 70 (ftyp)
        const isAudioSignature = 
          (firstBytes[0] === 0xFF && (firstBytes[1] === 0xFB || firstBytes[1] === 0xF3)) || // MP3
          (firstBytes[4] === 0x66 && firstBytes[5] === 0x74 && firstBytes[6] === 0x79 && firstBytes[7] === 0x70); // M4A/MP4 (ftyp)
        
        if (isLikelyBinary || isAudioSignature) {
          console.log('Response appears to be binary audio data (ArrayBuffer), signature detected');
          console.log(`Creating Blob from ArrayBuffer: size=${arrayBuffer.byteLength}, type=${correctMimeType}`);
          return new Blob([arrayBuffer], { type: correctMimeType });
        }
      }
    } catch (arrayBufferError) {
      console.log('Failed to get as ArrayBuffer, trying text:', arrayBufferError);
    }

    // Last resort: Try to parse as JSON (for API Gateway format with base64)
    // But first, try to get as ArrayBuffer if we haven't already
    let responseText: string;
    try {
      // Clone the response to read as text (since we might have already read it)
      const clonedResponse = response.clone();
      responseText = await clonedResponse.text();
    } catch (textError) {
      // If we can't clone, the response might already be consumed
      throw new Error('Failed to read response - response may have been consumed');
    }
    
    console.log('Lambda response text (first 200 chars):', responseText.substring(0, 200));
    
    // Check if it's actually binary data disguised as text (shouldn't happen with Function URLs)
    if (responseText.length > 0) {
      const firstChar = responseText.charCodeAt(0);
      const isBinaryStart = firstChar < 32 || firstChar === 0xFF; // Binary start or MP3 header
      const hasAudioSignature = responseText.startsWith('ftyp') || 
                                 (firstChar === 0xFF && (responseText.charCodeAt(1) === 0xFB || responseText.charCodeAt(1) === 0xF3));
      
      if (isBinaryStart || hasAudioSignature) {
        console.log('Response appears to be binary data (text format), converting to Blob');
        // Convert text to binary - this is a fallback, shouldn't normally happen
        const bytes = new Uint8Array(responseText.length);
        for (let i = 0; i < responseText.length; i++) {
          bytes[i] = responseText.charCodeAt(i) & 0xFF; // Ensure single byte
        }
        console.log(`Creating Blob from text (binary): size=${bytes.length}, type=${correctMimeType}`);
        return new Blob([bytes], { type: correctMimeType });
      }
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
          
          // Use the correct MIME type we determined earlier
          console.log(`Creating Blob from base64: size=${bytes.length}, type=${correctMimeType}`);
          return new Blob([bytes], { type: correctMimeType });
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

