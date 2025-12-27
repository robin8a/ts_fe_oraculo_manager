const https = require('https');
const http = require('http');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Parse body - could be string or object
    let bodyData = {};
    if (event.body) {
      bodyData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }
    
    const { serverUrl, apiKey, projectUid, format, downloadUrl } = bodyData;

    let targetUrl;
    if (downloadUrl) {
      // For audio file downloads
      targetUrl = downloadUrl;
    } else if (serverUrl && projectUid && format) {
      // For data fetching
      const baseUrl = serverUrl.startsWith('http') ? serverUrl : `https://${serverUrl}`;
      targetUrl = `${baseUrl}/api/v2/assets/${projectUid}/data.${format}`;
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Make request to KoboToolbox API
    const url = new URL(targetUrl);
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
                'Access-Control-Allow-Origin': '*',
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
                'Access-Control-Allow-Origin': '*',
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
            'Access-Control-Allow-Origin': '*',
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
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
