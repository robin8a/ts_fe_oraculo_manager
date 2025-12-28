const https = require('https');
const http = require('http');

exports.handler = async (event) => {
  // Support both Function URL and API Gateway event formats
  // Function URL: event.requestContext.http.method
  // API Gateway: event.httpMethod
  const httpMethod = event.requestContext?.http?.method || event.httpMethod || event.requestContext?.httpMethod || 'POST';
  const isOptions = httpMethod === 'OPTIONS';
  
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
  
  // Handle CORS preflight
  if (isOptions) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Parse body - Function URL and API Gateway both send body as string
    let bodyData = {};
    if (event.body) {
      try {
        bodyData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (parseError) {
        console.error('Error parsing body:', parseError);
        return {
          statusCode: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        };
      }
    }
    
    const { serverUrl, apiKey, projectUid, format, downloadUrl } = bodyData;

    let targetUrl;
    if (downloadUrl) {
      // For audio file downloads
      // Validate and normalize the URL
      if (typeof downloadUrl !== 'string' || downloadUrl.trim() === '') {
        return {
          statusCode: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid downloadUrl: must be a non-empty string' }),
        };
      }
      
      // If it's not a full URL, try to construct it
      if (!downloadUrl.startsWith('http://') && !downloadUrl.startsWith('https://')) {
        // It's a relative path, construct full URL
        const baseUrl = serverUrl && serverUrl.startsWith('http') 
          ? serverUrl 
          : serverUrl 
          ? `https://${serverUrl}`
          : 'https://kf.kobotoolbox.org'; // Default fallback
        targetUrl = downloadUrl.startsWith('/') 
          ? `${baseUrl}${downloadUrl}`
          : `${baseUrl}/${downloadUrl}`;
      } else {
        targetUrl = downloadUrl;
      }
      
      // Validate URL format
      try {
        new URL(targetUrl);
      } catch (urlError) {
        return {
          statusCode: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: `Invalid URL format: ${targetUrl}`,
            originalUrl: downloadUrl,
            details: urlError.message 
          }),
        };
      }
    } else if (serverUrl && projectUid && format) {
      // For data fetching
      const baseUrl = serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`;
      targetUrl = `${baseUrl}/api/v2/assets/${projectUid}/data.${format}`;
    } else {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Make request to KoboToolbox API
    let url;
    try {
      url = new URL(targetUrl);
    } catch (urlError) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: `Invalid URL: ${targetUrl}`,
          details: urlError.message 
        }),
      };
    }
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const protocol = url.protocol === 'https:' ? https : http;
      const req = protocol.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          // Determine content type based on response
          const contentType = downloadUrl 
            ? res.headers['content-type'] || 'application/octet-stream'
            : 'application/json';

          // For binary data (audio files), encode as base64
          if (downloadUrl) {
            const base64Data = Buffer.from(data, 'binary').toString('base64');
            resolve({
              statusCode: res.statusCode,
              headers: {
                ...corsHeaders,
                'Content-Type': contentType,
              },
              body: base64Data,
              isBase64Encoded: true,
            });
          } else {
            // For JSON/CSV text data
            resolve({
              statusCode: res.statusCode,
              headers: {
                ...corsHeaders,
                'Content-Type': contentType,
              },
              body: data,
            });
          }
        });
      });

      req.on('error', (error) => {
        reject({
          statusCode: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: error.message }),
        });
      });

      req.end();
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
