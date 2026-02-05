const { S3Client, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AWS clients
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

// GraphQL endpoint and API key (set via Amplify environment variables from dependsOn)
const GRAPHQL_ENDPOINT = process.env.API_TSBEORACULOAPI_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_TSBEORACULOAPI_GRAPHQLAPIKEYOUTPUT;

// Get base bucket name from environment variable
// Note: Amplify may pass just the base name, but the actual bucket includes stack ID and environment suffix
// We'll extract the bucket name from S3 URLs when needed, which is more reliable
const BASE_BUCKET_NAME = process.env.STORAGE_S3744E127B_BUCKETNAME;
const ENV = process.env.ENV || 'dev';

// Default S3 bucket name - will be overridden by extracting from S3 URLs when available
const S3_BUCKET = BASE_BUCKET_NAME;

// Validate required environment variables
if (!GRAPHQL_ENDPOINT || !GRAPHQL_API_KEY || !S3_BUCKET) {
  console.error('Missing required environment variables:', {
    GRAPHQL_ENDPOINT: !!GRAPHQL_ENDPOINT,
    GRAPHQL_API_KEY: !!GRAPHQL_API_KEY,
    S3_BUCKET: !!S3_BUCKET,
  });
}

// GraphQL queries - Using nested query approach like frontend component
const LIST_TREES_WITH_RAWDATA_QUERY = `
  query ListTreesWithRawData($filter: ModelTreeFilterInput, $limit: Int, $nextToken: String) {
    listTrees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        templateTreesId
        rawData {
          items {
            id
            name
            valueString
            valueFloat
            treeRawDataId
            featureRawDatasId
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

// Keep the old query for backward compatibility if needed
const LIST_RAWDATA_QUERY = `
  query ListRawData($filter: ModelRawDataFilterInput, $limit: Int, $nextToken: String) {
    listRawData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        valueString
        valueFloat
        treeRawDataId
        featureRawDatasId
      }
      nextToken
    }
  }
`;

const GET_TEMPLATE_QUERY = `
  query GetTemplate($id: ID!) {
    getTemplate(id: $id) {
      id
      name
    }
  }
`;

const GET_TREE_WITH_RAWDATA_QUERY = `
  query GetTreeWithRawData($id: ID!) {
    getTree(id: $id) {
      id
      name
      status
      templateTreesId
      rawData {
        items {
          id
          name
          valueString
          valueFloat
          treeRawDataId
          featureRawDatasId
        }
        nextToken
      }
    }
  }
`;

const LIST_TEMPLATE_FEATURES_QUERY = `
  query ListTemplateFeatures($filter: ModelTemplateFeatureFilterInput, $limit: Int, $nextToken: String) {
    listTemplateFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        feature {
          id
          name
          description
          feature_type
          is_float
        }
      }
      nextToken
    }
  }
`;

const CREATE_RAWDATA_MUTATION = `
  mutation CreateRawData($input: CreateRawDataInput!) {
    createRawData(input: $input) {
      id
      name
      valueString
      valueFloat
      treeRawDataId
      featureRawDatasId
    }
  }
`;

// Helper function to make GraphQL requests
async function graphqlRequest(query, variables = {}) {
  if (!GRAPHQL_ENDPOINT) {
    throw new Error('GRAPHQL_ENDPOINT environment variable is not set');
  }
  if (!GRAPHQL_API_KEY) {
    throw new Error('GRAPHQL_API_KEY environment variable is not set');
  }

  return new Promise((resolve, reject) => {
    try {
      const url = new URL(GRAPHQL_ENDPOINT);
      const postData = JSON.stringify({ query, variables });

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': GRAPHQL_API_KEY,
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 30000, // 30 second timeout
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              reject(new Error(`GraphQL request failed with status ${res.statusCode}: ${data.substring(0, 500)}`));
              return;
            }
            const result = JSON.parse(data);
            if (result.errors) {
              reject(new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`));
            } else {
              resolve(result.data);
            }
          } catch (error) {
            reject(new Error(`Failed to parse GraphQL response: ${error.message}. Response: ${data.substring(0, 500)}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`GraphQL request error: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('GraphQL request timeout'));
      });

      req.setTimeout(30000);

      req.write(postData);
      req.end();
    } catch (error) {
      reject(new Error(`Failed to create GraphQL request: ${error.message}`));
    }
  });
}

// Check if a string is an S3 URL pointing to an audio file
function isAudioS3Url(valueString) {
  if (!valueString || typeof valueString !== 'string') {
    return false;
  }
  const isS3Url = valueString.includes('.s3.') && valueString.includes('amazonaws.com');
  if (!isS3Url) {
    return false;
  }
  const lowerValue = valueString.toLowerCase();
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
  const hasAudioExtension = audioExtensions.some(ext => lowerValue.includes(ext));
  const hasAudioPath = lowerValue.includes('/audio/');
  return hasAudioExtension || hasAudioPath;
}

// Extract S3 bucket name from S3 URL
function extractS3BucketFromUrl(s3Url) {
  try {
    const url = new URL(s3Url);
    // S3 URL formats:
    // 1. https://{bucket}.s3.{region}.amazonaws.com/{key}
    // 2. https://s3.{region}.amazonaws.com/{bucket}/{key}
    // 3. https://{bucket}.s3-{region}.amazonaws.com/{key}
    
    const hostname = url.hostname;
    
    // Format 1 & 3: bucket is the first part of the hostname
    if (hostname.includes('.s3.')) {
      const parts = hostname.split('.s3.');
      if (parts.length > 0) {
        return parts[0];
      }
    } else if (hostname.startsWith('s3.') || hostname.startsWith('s3-')) {
      // Format 2: bucket is the first part of the path
      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length > 0) {
        return pathParts[0];
      }
    }
    
    // Fallback: try to extract from hostname before first dot
    const firstDot = hostname.indexOf('.');
    if (firstDot > 0) {
      return hostname.substring(0, firstDot);
    }
    
    throw new Error(`Unable to extract bucket name from URL: ${s3Url}`);
  } catch (error) {
    throw new Error(`Unable to extract bucket name from URL: ${s3Url} - ${error.message}`);
  }
}

// Extract S3 key from S3 URL
function extractS3KeyFromUrl(s3Url) {
  try {
    const url = new URL(s3Url);
    const hostname = url.hostname;
    
    // For format 2 (s3.{region}.amazonaws.com/{bucket}/{key}), skip the bucket part
    if (hostname.startsWith('s3.') || hostname.startsWith('s3-')) {
      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length > 1) {
        // Skip the bucket name (first part), return the rest as the key
        return pathParts.slice(1).join('/');
      }
      // If only one part, it might be just the key (unlikely but handle it)
      if (pathParts.length === 1) {
        return pathParts[0];
      }
    }
    
    // For formats 1 & 3 ({bucket}.s3.{region}.amazonaws.com/{key}), 
    // the key is the pathname without leading slash
    // Remove query parameters and fragments if present
    let key = url.pathname;
    if (key.startsWith('/')) {
      key = key.substring(1);
    }
    
    // Decode the key in case it's URL encoded
    try {
      key = decodeURIComponent(key);
    } catch (e) {
      // If decoding fails, use the original key
      console.warn('Failed to decode S3 key, using as-is:', key);
    }
    
    return key;
  } catch (error) {
    throw new Error(`Unable to extract S3 key from URL: ${s3Url} - ${error.message}`);
  }
}

// Find the actual S3 key by searching for files that match the expected key
// This handles cases where Amplify Storage adds prefixes like 'protected/us-east-1:{userId}/'
async function findActualS3Key(bucketName, expectedKey, providedTreeId = null) {
  try {
    // Extract the filename from the expected key
    const filename = expectedKey.split('/').pop();
    const keyPath = expectedKey.substring(0, expectedKey.lastIndexOf('/'));
    const keyPathParts = keyPath.split('/');
    
    console.log(`Searching for file - expectedKey: ${expectedKey}, filename: ${filename}, keyPath: ${keyPath}`);
    
    // Use provided treeId if available, otherwise extract from path
    let treeId = providedTreeId;
    const audioIndex = keyPathParts.indexOf('audio');
    if (!treeId && audioIndex >= 0 && audioIndex < keyPathParts.length - 1) {
      treeId = keyPathParts[audioIndex + 1];
      console.log(`Extracted treeId from path: ${treeId}`);
    } else if (treeId) {
      console.log(`Using provided treeId: ${treeId}`);
    }
    
    // Try different prefixes that Amplify Storage might use
    const prefixesToTry = [
      expectedKey, // Try the exact key first
      `protected/${expectedKey}`, // Try with protected prefix
      `public/${expectedKey}`, // Try with public prefix
    ];
    
    // If we have a treeId, search for files with protected/us-east-1:{userId}/audio/{treeId}/... pattern
    if (treeId) {
      // The real pattern is: protected/us-east-1:{userId}/audio/{treeId}/audio_levantamiento/{filename}
      // We need to search for files matching this pattern
      const pathAfterTreeId = keyPathParts.slice(audioIndex + 2).join('/');
      console.log(`Path after treeId: ${pathAfterTreeId}`);
      
      // Search in protected/ directory for files matching the pattern
      const protectedPrefix = 'protected/';
      const protectedListCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: protectedPrefix,
        MaxKeys: 10000, // Large limit to search more files
      });
      
      try {
        console.log(`Searching in protected/ directory for files matching treeId: ${treeId}, filename: ${filename}`);
        const protectedListResponse = await s3Client.send(protectedListCommand);
        
        if (protectedListResponse.Contents && protectedListResponse.Contents.length > 0) {
          console.log(`Found ${protectedListResponse.Contents.length} objects in protected/ directory`);
          
          // Find objects that:
          // 1. End with our filename (or similar timestamp-based filename)
          // 2. Match the path structure (audio/{treeId}/audio_levantamiento/...)
          // Note: treeId might be different, so we match by path structure and filename pattern
          const pathStructure = pathAfterTreeId ? pathAfterTreeId.split('/')[0] : null; // e.g., "audio_levantamiento"
          
          const matchingObjects = protectedListResponse.Contents.filter(obj => {
            if (!obj.Key) return false;
            
            // Must be in the protected/us-east-1:{userId}/audio/{treeId}/... pattern
            if (!obj.Key.includes('/audio/')) return false;
            
            // Must end with our filename OR a similar filename (same extension, similar timestamp)
            const objFilename = obj.Key.split('/').pop();
            const objExt = objFilename.split('.').pop();
            const expectedExt = filename.split('.').pop();
            
            // Match if same extension and similar filename structure
            const filenameMatches = objFilename === filename || 
                                   (objExt === expectedExt && objFilename.match(/^\d+\./)); // Timestamp-based filenames
            
            if (!filenameMatches) return false;
            
            // Must contain the path structure (audio_levantamiento or similar)
            if (pathStructure && !obj.Key.includes(pathStructure)) return false;
            
            // Prefer files that match the treeId if available, but don't require it
            // (since the treeId in the URL might be different from the actual file's treeId)
            
            return true;
          });
          
          if (matchingObjects.length > 0) {
            // Prefer matches in this order:
            // 1. Exact filename match
            // 2. Matches with treeId (if provided)
            // 3. Matches with path structure
            let bestMatch = matchingObjects.find(obj => obj.Key.endsWith(filename));
            
            if (!bestMatch && treeId) {
              bestMatch = matchingObjects.find(obj => obj.Key.includes(`/audio/${treeId}/`));
            }
            
            if (!bestMatch && pathStructure) {
              bestMatch = matchingObjects.find(obj => obj.Key.includes(pathStructure));
            }
            
            bestMatch = bestMatch || matchingObjects[0];
            
            console.log(`Found ${matchingObjects.length} matching objects, using: ${bestMatch.Key}`);
            return bestMatch.Key;
          }
        }
      } catch (protectedError) {
        console.log(`Error searching protected/ directory:`, protectedError.message);
      }
    }
    
    // First, try listing objects with the key path prefix to find matches
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: keyPath,
      MaxKeys: 100,
    });
    
    try {
      const listResponse = await s3Client.send(listCommand);
      
      if (listResponse.Contents && listResponse.Contents.length > 0) {
        console.log(`Found ${listResponse.Contents.length} objects with prefix ${keyPath}`);
        // Find the object that ends with our filename
        const matchingObject = listResponse.Contents.find(obj => 
          obj.Key && obj.Key.endsWith(filename)
        );
        
        if (matchingObject && matchingObject.Key) {
          console.log(`Found matching object with key: ${matchingObject.Key}`);
          return matchingObject.Key;
        }
      }
    } catch (listError) {
      console.log(`Listing with prefix ${keyPath} failed, trying other methods:`, listError.message);
    }
    
    // Try searching in protected/ directory with the filename
    // Real pattern: protected/us-east-1:{userId}/audio/{treeId}/audio_levantamiento/{filename}
    const protectedListCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'protected/',
      MaxKeys: 10000, // Increased limit to search more files
    });
    
    try {
      const protectedListResponse = await s3Client.send(protectedListCommand);
      
      if (protectedListResponse.Contents && protectedListResponse.Contents.length > 0) {
        console.log(`Found ${protectedListResponse.Contents.length} objects in protected/`);
        
        // Extract treeId from expected key path
        let treeId = null;
        const audioIndex = keyPathParts.indexOf('audio');
        if (audioIndex >= 0 && audioIndex < keyPathParts.length - 1) {
          treeId = keyPathParts[audioIndex + 1];
        }
        
        // Find objects that:
        // 1. End with our filename
        // 2. Match the pattern: protected/us-east-1:{userId}/audio/{treeId}/...
        // 3. Contain the path structure (audio_levantamiento or similar)
        const pathSearchTerms = keyPathParts.filter(p => p && p !== 'audio' && p.length > 3);
        const matchingObjects = protectedListResponse.Contents.filter(obj => {
          if (!obj.Key) return false;
          
          // Must end with our filename
          if (!obj.Key.endsWith(filename)) return false;
          
          // Must match the pattern: protected/us-east-1:{userId}/audio/{treeId}/...
          if (!obj.Key.includes('/audio/')) return false;
          
          // If we have a treeId, it must be in the path
          if (treeId && !obj.Key.includes(`/audio/${treeId}/`)) return false;
          
          // Must contain important path parts (like audio_levantamiento)
          if (pathSearchTerms.length > 0) {
            const hasPathMatch = pathSearchTerms.some(term => obj.Key.includes(term));
            if (!hasPathMatch) return false;
          }
          
          return true;
        });
        
        if (matchingObjects.length > 0) {
          // Prefer the one that matches the treeId most closely
          const bestMatch = treeId 
            ? matchingObjects.find(obj => obj.Key.includes(`/audio/${treeId}/`)) || matchingObjects[0]
            : matchingObjects[0];
          
          console.log(`Found ${matchingObjects.length} matching protected objects, using: ${bestMatch.Key}`);
          return bestMatch.Key;
        }
      }
    } catch (protectedError) {
      console.log(`Listing protected/ directory failed:`, protectedError.message);
    }
    
    // Try searching in public/ directory
    const publicListCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'public/',
      MaxKeys: 1000,
    });
    
    try {
      const publicListResponse = await s3Client.send(publicListCommand);
      
      if (publicListResponse.Contents && publicListResponse.Contents.length > 0) {
        console.log(`Found ${publicListResponse.Contents.length} objects in public/`);
        const pathSearchTerms = keyPathParts.filter(p => p && p !== 'audio');
        const matchingObject = publicListResponse.Contents.find(obj => {
          if (!obj.Key || !obj.Key.endsWith(filename)) return false;
          return pathSearchTerms.every(term => obj.Key.includes(term));
        });
        
        if (matchingObject && matchingObject.Key) {
          console.log(`Found matching public object with key: ${matchingObject.Key}`);
          return matchingObject.Key;
        }
      }
    } catch (publicError) {
      console.log(`Listing public/ directory failed:`, publicError.message);
    }
    
    // If listing didn't work, try the prefixes directly
    for (const prefix of prefixesToTry) {
      // Skip wildcard patterns (they won't work with GetObjectCommand)
      if (prefix.includes('*')) continue;
      
      try {
        const testCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: prefix,
        });
        // Try to get the object (just head would be better but GetObject works)
        const testResponse = await s3Client.send(testCommand);
        if (testResponse) {
          console.log(`Found file with key: ${prefix}`);
          return prefix;
        }
      } catch (e) {
        // Continue to next prefix
        continue;
      }
    }
    
    // Last resort: search for the filename anywhere in the bucket
    console.log(`Last resort: searching for filename ${filename} anywhere in bucket`);
    const globalSearchCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 10000, // Large limit to search more files
    });
    
    try {
      const globalResponse = await s3Client.send(globalSearchCommand);
      if (globalResponse.Contents && globalResponse.Contents.length > 0) {
        const pathSearchTerms = keyPathParts.filter(p => p && p !== 'audio' && p.length > 5);
        const matchingObject = globalResponse.Contents.find(obj => {
          if (!obj.Key || !obj.Key.endsWith(filename)) return false;
          // Match if it contains the important path parts
          return pathSearchTerms.length === 0 || pathSearchTerms.some(term => obj.Key.includes(term));
        });
        
        if (matchingObject && matchingObject.Key) {
          console.log(`Found matching object in global search with key: ${matchingObject.Key}`);
          return matchingObject.Key;
        }
      }
    } catch (globalError) {
      console.log(`Global search failed:`, globalError.message);
    }
    
    return null;
  } catch (error) {
    console.error('Error searching for S3 key:', error);
    return null;
  }
}

// Download audio file from S3
async function downloadAudioFromS3(s3Url, treeId = null) {
  try {
    // Extract bucket name from the S3 URL (more reliable than using environment variable)
    const bucketName = extractS3BucketFromUrl(s3Url);
    let s3Key = extractS3KeyFromUrl(s3Url);
    console.log(`Downloading audio from S3 URL: ${s3Url}`);
    console.log(`Extracted bucket: ${bucketName}, key: ${s3Key}`);
    if (treeId) {
      console.log(`Using treeId for search: ${treeId}`);
    }

    // Try to get the object with the extracted key first
    let command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    try {
      const response = await s3Client.send(command);
      const chunks = [];
      
      return new Promise((resolve, reject) => {
        response.Body.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.Body.on('end', () => {
          const buffer = Buffer.concat(chunks);
          console.log(`Downloaded ${buffer.length} bytes from S3`);
          resolve(buffer);
        });

        response.Body.on('error', (error) => {
          reject(error);
        });
      });
    } catch (firstError) {
      // If the key doesn't exist, try to find the actual key
      const isNoSuchKey = firstError.name === 'NoSuchKey' || 
                         firstError.message.includes('does not exist') || 
                         firstError.message.includes('NoSuchKey');
      
      if (isNoSuchKey) {
        console.log(`Key "${s3Key}" not found in bucket "${bucketName}", searching for actual key...`);
        console.log(`Original URL: ${s3Url}`);
        const actualKey = await findActualS3Key(bucketName, s3Key, treeId);
        
        if (actualKey) {
          console.log(`Successfully found key: ${actualKey}`);
          s3Key = actualKey;
          
          // Try again with the found key
          command = new GetObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
          });

          const response = await s3Client.send(command);
          const chunks = [];
          
          return new Promise((resolve, reject) => {
            response.Body.on('data', (chunk) => {
              chunks.push(chunk);
            });

            response.Body.on('end', () => {
              const buffer = Buffer.concat(chunks);
              console.log(`Downloaded ${buffer.length} bytes from S3 using key: ${s3Key}`);
              resolve(buffer);
            });

            response.Body.on('error', (error) => {
              reject(error);
            });
          });
        } else {
          // Before throwing error, try one more comprehensive search
          console.log(`Comprehensive search failed. Attempting final search with filename only...`);
          const filename = s3Key.split('/').pop();
          const finalSearchCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 10000,
          });
          
          try {
            const finalResponse = await s3Client.send(finalSearchCommand);
            if (finalResponse.Contents) {
              const exactMatch = finalResponse.Contents.find(obj => obj.Key && obj.Key.endsWith(filename));
              if (exactMatch) {
                console.log(`Found file with exact filename match: ${exactMatch.Key}`);
                s3Key = exactMatch.Key;
                
                command = new GetObjectCommand({
                  Bucket: bucketName,
                  Key: s3Key,
                });
                
                const response = await s3Client.send(command);
                const chunks = [];
                
                return new Promise((resolve, reject) => {
                  response.Body.on('data', (chunk) => {
                    chunks.push(chunk);
                  });

                  response.Body.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    console.log(`Downloaded ${buffer.length} bytes from S3 using found key: ${s3Key}`);
                    resolve(buffer);
                  });

                  response.Body.on('error', (error) => {
                    reject(error);
                  });
                });
              }
            }
          } catch (finalError) {
            console.error(`Final search also failed:`, finalError.message);
          }
          
          throw new Error(`S3 key does not exist and could not be found. Bucket: ${bucketName}, Expected Key: ${s3Key}. Original URL: ${s3Url}`);
        }
      } else {
        throw firstError;
      }
    }
  } catch (error) {
    // Provide more detailed error information
    const errorMessage = error.message || String(error);
    throw new Error(`Failed to download audio from S3: ${errorMessage}. URL: ${s3Url}`);
  }
}

// Process audio file with Gemini API
async function processAudioWithGemini(audioBuffer, features, geminiApiKey) {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  let tempFilePath = null;
  
  try {
    // Initialize Gemini AI with the API key
    // The SDK will automatically use the latest API version (v1) for newer models
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Write buffer to temp file
    tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
    fs.writeFileSync(tempFilePath, audioBuffer);
    console.log(`Written ${audioBuffer.length} bytes to temp file: ${tempFilePath}`);

    // For JavaScript SDK, use FileDataPart with the file data
    // Convert buffer to base64 for inline upload (works for all SDK versions)
    const base64Audio = audioBuffer.toString('base64');
    const uploadedFile = {
      inlineData: {
        data: base64Audio,
        mimeType: 'audio/mp4',
      },
    };
    console.log(`Using inline file data (base64 encoded, ${base64Audio.length} chars)`);

    // Build prompt with feature names
    const featureDescriptions = features.map(f => 
      `- ${f.name}${f.description ? ` (${f.description})` : ''}${f.is_float ? ' (number)' : ' (string)'}`
    ).join('\n');

    const prompt = `Extract the technical information from the audio and return it strictly in JSON format.
If a value is not mentioned, set it to null.
Required fields:
${featureDescriptions}

Return a JSON object with the field names exactly as listed above.`;

    // Configure model for JSON output
    // Use latest stable model names (updated 2026)
    // Order: Try fastest/cheapest first, then more capable models
    const modelNames = [
      'gemini-2.5-flash',           // Latest fast model (recommended)
      'gemini-2.5-flash-lite',      // Ultra-fast / Low-cost
      'gemini-3-flash-preview',     // Experimental / Next-Gen
      'gemini-2.5-pro',             // High Intelligence
    ];
    
    let extractedData;
    let lastError;
    
    for (const modelName of modelNames) {
      try {
        console.log(`Attempting to use model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        console.log('Calling Gemini API to extract features...');
        const result = await model.generateContent([prompt, uploadedFile]);
        const response = await result.response;
        extractedData = JSON.parse(response.text());
        console.log(`Successfully used model: ${modelName}`);
        break; // Success, exit loop
      } catch (modelError) {
        console.warn(`Model ${modelName} failed: ${modelError.message}`);
        lastError = modelError;
        // Continue to next model
        continue;
      }
    }
    
    if (!extractedData) {
      throw new Error(`All model attempts failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    console.log('Extracted data:', JSON.stringify(extractedData, null, 2));

    return extractedData;
  } catch (error) {
    throw new Error(`Failed to process audio with Gemini: ${error.message}`);
  } finally {
    // Always clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn('Error deleting temp file:', cleanupError.message);
      }
    }
  }
}

// Main handler
exports.handler = async (event) => {
  console.log('Lambda function invoked. Event:', JSON.stringify(event, null, 2));
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight
  const httpMethod = event.requestContext?.http?.method || event.httpMethod || event.requestContext?.httpMethod;
  if (httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    console.log('Processing request. Method:', httpMethod);
    // Validate environment variables first
    if (!GRAPHQL_ENDPOINT || !GRAPHQL_API_KEY || !S3_BUCKET) {
      console.error('Missing environment variables:', {
        GRAPHQL_ENDPOINT: !!GRAPHQL_ENDPOINT,
        GRAPHQL_API_KEY: !!GRAPHQL_API_KEY,
        S3_BUCKET: !!S3_BUCKET,
      });
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Lambda function configuration error: Missing required environment variables (GRAPHQL_ENDPOINT, GRAPHQL_API_KEY, or S3_BUCKET)',
        }),
      };
    }

    // Parse request body
    let bodyData = {};
    if (event.body) {
      try {
        bodyData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }),
        };
      }
    }

    const { treeIds, templateId, geminiApiKey } = bodyData;

    if (!templateId || !geminiApiKey) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required parameters: templateId and geminiApiKey are required' }),
      };
    }

    console.log('Processing audio to features:', { 
      treeIds: treeIds ? treeIds.length : 'all', 
      treeIdsArray: treeIds,
      templateId,
      hasGeminiKey: !!geminiApiKey 
    });

    // Step 1: Get Template and Features
    console.log('Fetching template and features...');
    const templateData = await graphqlRequest(GET_TEMPLATE_QUERY, { id: templateId });
    const template = templateData.getTemplate;

    if (!template) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Template not found' }),
      };
    }

    // Get TemplateFeatures for this template
    const templateFeaturesData = await graphqlRequest(LIST_TEMPLATE_FEATURES_QUERY, {
      filter: { templateTemplateFeaturesId: { eq: templateId } },
      limit: 1000,
    });

    const features = (templateFeaturesData.listTemplateFeatures.items || [])
      .map(tf => tf.feature)
      .filter(f => f);
    console.log(`Found ${features.length} features in template`);

    if (features.length === 0) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Template has no features' }),
      };
    }

    // Step 2: Get Trees with nested RawData
    console.log('Fetching trees with rawData...');
    
    let trees = [];
    
    // For single treeId, use getTree directly (more reliable than listTrees filter)
    if (treeIds && treeIds.length === 1) {
      console.log('Using getTree for single treeId:', treeIds[0]);
      try {
        const treeData = await graphqlRequest(GET_TREE_WITH_RAWDATA_QUERY, { id: treeIds[0] });
        console.log('getTree response:', JSON.stringify(treeData, null, 2));
        
        if (treeData.getTree) {
          // Convert getTree result to same format as listTrees
          trees = [treeData.getTree];
          console.log(`Found tree using getTree: ${treeData.getTree.name} (${treeData.getTree.id})`);
        } else {
          console.log('getTree returned null - tree does not exist');
        }
      } catch (getTreeError) {
        console.error('Error fetching tree with getTree:', getTreeError);
        throw new Error(`Failed to fetch tree ${treeIds[0]}: ${getTreeError.message}`);
      }
    } else {
      // For multiple treeIds or all trees, use listTrees
      let treeFilter = undefined;
      if (treeIds && treeIds.length > 1) {
        // For multiple treeIds, use or filter
        treeFilter = { or: treeIds.map(id => ({ id: { eq: id } })) };
      }
      
      console.log('Tree filter:', JSON.stringify(treeFilter, null, 2));
      console.log('Tree IDs being searched:', treeIds);
      
      let treesData;
      try {
        treesData = await graphqlRequest(LIST_TREES_WITH_RAWDATA_QUERY, {
          filter: treeFilter,
          limit: 1000, // Adjust as needed
        });
        console.log('GraphQL response received:', JSON.stringify(treesData, null, 2));
      } catch (graphqlError) {
        console.error('GraphQL request failed:', graphqlError);
        console.error('GraphQL error details:', {
          message: graphqlError.message,
          stack: graphqlError.stack,
          filter: treeFilter,
          treeIds: treeIds,
        });
        throw new Error(`Failed to fetch trees: ${graphqlError.message}`);
      }

      trees = treesData.listTrees?.items || [];
      console.log(`Found ${trees.length} trees to process`);
      
      if (trees.length === 0 && treeIds && treeIds.length > 0) {
        console.log('WARNING: No trees found for provided treeIds:', treeIds);
        console.log('GraphQL response structure:', JSON.stringify(treesData, null, 2));
      }
    }
    
    console.log(`Total trees to process: ${trees.length}`);

    if (trees.length === 0) {
      const errorMessage = treeIds && treeIds.length > 0
        ? `No trees found to process for provided treeIds: ${treeIds.join(', ')}. The trees may not exist, may have been deleted, or may have been processed already.`
        : 'No trees found to process';
      
      console.log('ERROR: ' + errorMessage);
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: errorMessage,
          results: [],
        }),
      };
    }

    // Step 3: Process each tree
    const results = [];
    let totalProcessed = 0;
    let totalErrors = 0;

    for (const tree of trees) {
      console.log(`Processing tree: ${tree.id} (${tree.name})`);

      // Get RawData from nested query (same as frontend component)
      const rawDataItems = tree.rawData?.items || [];
      console.log(`Tree ${tree.id} has ${rawDataItems.length} rawData items total`);
      
      // Filter for audio files
      const audioRawData = rawDataItems.filter(rd => rd.valueString && isAudioS3Url(rd.valueString));
      console.log(`Found ${audioRawData.length} audio files for tree ${tree.id}`);
      
      // Log some rawData items for debugging
      if (rawDataItems.length > 0 && audioRawData.length === 0) {
        console.log(`Debug: Sample rawData items for tree ${tree.id}:`, 
          rawDataItems.slice(0, 3).map(rd => ({
            id: rd.id,
            hasValueString: !!rd.valueString,
            valueStringPreview: rd.valueString ? rd.valueString.substring(0, 50) : 'null',
            featureId: rd.featureRawDatasId
          }))
        );
      }

      const treeResult = {
        treeId: tree.id,
        treeName: tree.name,
        audioCount: audioRawData.length,
        processed: 0,
        errors: [],
        featuresExtracted: 0,
      };

      // Process each audio file
      for (const audioRawDataItem of audioRawData) {
        try {
          console.log(`Processing audio: ${audioRawDataItem.valueString}`);

          // Download audio from S3 (pass treeId to help with search)
          const audioBuffer = await downloadAudioFromS3(audioRawDataItem.valueString, tree.id);

          // Process with Gemini
          const extractedData = await processAudioWithGemini(audioBuffer, features, geminiApiKey);

          // Create RawData entries for each extracted feature
          let featuresCreated = 0;
          for (const feature of features) {
            const featureName = feature.name;
            const extractedValue = extractedData[featureName];

            if (extractedValue !== null && extractedValue !== undefined) {
              try {
                const rawDataInput = {
                  name: featureName,
                  treeRawDataId: tree.id,
                  featureRawDatasId: feature.id,
                };

                // Set value based on feature type
                if (feature.is_float) {
                  const numValue = typeof extractedValue === 'number' 
                    ? extractedValue 
                    : parseFloat(extractedValue);
                  if (!isNaN(numValue)) {
                    rawDataInput.valueFloat = numValue;
                  } else {
                    rawDataInput.valueString = String(extractedValue);
                  }
                } else {
                  rawDataInput.valueString = String(extractedValue);
                }

                await graphqlRequest(CREATE_RAWDATA_MUTATION, {
                  input: rawDataInput,
                });

                featuresCreated++;
              } catch (error) {
                console.error(`Error creating RawData for feature ${featureName}:`, error);
                treeResult.errors.push(`Failed to create RawData for ${featureName}: ${error.message}`);
              }
            }
          }

          treeResult.processed++;
          treeResult.featuresExtracted += featuresCreated;
          totalProcessed++;
        } catch (error) {
          console.error(`Error processing audio ${audioRawDataItem.valueString}:`, error);
          treeResult.errors.push(`Failed to process audio: ${error.message}`);
          totalErrors++;
        }
      }

      results.push(treeResult);
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: `Processed ${totalProcessed} audio files with ${totalErrors} errors`,
        results,
        summary: {
          totalTrees: trees.length,
          totalAudioFiles: results.reduce((sum, r) => sum + r.audioCount, 0),
          totalProcessed,
          totalErrors,
          totalFeaturesExtracted: results.reduce((sum, r) => sum + r.featuresExtracted, 0),
        },
      }),
    };
  } catch (error) {
    console.error('Lambda error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        type: error.constructor.name,
      }),
    };
  }
};
