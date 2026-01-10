const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AWS clients
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

// GraphQL endpoint and API key (set via Amplify environment variables from dependsOn)
const GRAPHQL_ENDPOINT = process.env.API_TSBEORACULOAPI_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_TSBEORACULOAPI_GRAPHQLAPIKEYOUTPUT;
const S3_BUCKET = process.env.STORAGE_S3744E127B_BUCKETNAME;

// Validate required environment variables
if (!GRAPHQL_ENDPOINT || !GRAPHQL_API_KEY || !S3_BUCKET) {
  console.error('Missing required environment variables:', {
    GRAPHQL_ENDPOINT: !!GRAPHQL_ENDPOINT,
    GRAPHQL_API_KEY: !!GRAPHQL_API_KEY,
    S3_BUCKET: !!S3_BUCKET,
  });
}

// GraphQL queries
const LIST_TREES_QUERY = `
  query ListTrees($filter: ModelTreeFilterInput, $limit: Int, $nextToken: String) {
    listTrees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        templateTreesId
      }
      nextToken
    }
  }
`;

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

// Extract S3 key from S3 URL
function extractS3KeyFromUrl(s3Url) {
  try {
    const url = new URL(s3Url);
    // Remove leading slash from pathname
    return url.pathname.substring(1);
  } catch (error) {
    throw new Error(`Unable to extract S3 key from URL: ${s3Url}`);
  }
}

// Download audio file from S3
async function downloadAudioFromS3(s3Url) {
  try {
    const s3Key = extractS3KeyFromUrl(s3Url);
    console.log(`Downloading audio from S3: ${s3Key}`);

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
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
        console.log(`Downloaded ${buffer.length} bytes from S3`);
        resolve(buffer);
      });

      response.Body.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(`Failed to download audio from S3: ${error.message}`);
  }
}

// Process audio file with Gemini API
async function processAudioWithGemini(audioBuffer, features, geminiApiKey) {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  let tempFilePath = null;
  
  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Write buffer to temp file (Gemini File API requires file path)
    tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
    fs.writeFileSync(tempFilePath, audioBuffer);
    console.log(`Written ${audioBuffer.length} bytes to temp file: ${tempFilePath}`);

    // Upload file to Gemini File API
    console.log('Uploading audio to Gemini File API...');
    const uploadResult = await genAI.uploadFile(tempFilePath, {
      mimeType: 'audio/mp4',
    });

    const uploadedFile = uploadResult.file;
    console.log(`File uploaded: ${uploadedFile.uri}, name: ${uploadedFile.name}`);

    // Wait for file to be processed
    let fileStatus = uploadedFile.state;
    let waitCount = 0;
    const maxWait = 60; // Max 60 seconds
    
    while (fileStatus === 'PROCESSING' && waitCount < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      waitCount++;
      try {
        const fileInfo = await genAI.getFile(uploadedFile.name);
        fileStatus = fileInfo.state;
      } catch (err) {
        console.warn('Error checking file status:', err.message);
        break;
      }
    }

    if (fileStatus !== 'ACTIVE') {
      throw new Error(`File processing failed or timed out. Status: ${fileStatus}`);
    }

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
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    console.log('Calling Gemini API to extract features...');
    const result = await model.generateContent([prompt, uploadedFile]);
    const response = await result.response;
    const extractedData = JSON.parse(response.text());

    console.log('Extracted data:', JSON.stringify(extractedData, null, 2));

    // Clean up uploaded file and temp file
    try {
      await genAI.deleteFile(uploadedFile.name);
    } catch (cleanupError) {
      console.warn('Error deleting uploaded file:', cleanupError.message);
    }

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

    // Step 2: Get Trees
    console.log('Fetching trees...');
    const treeFilter = treeIds && treeIds.length > 0
      ? { id: { in: treeIds } }
      : {};
    
    const treesData = await graphqlRequest(LIST_TREES_QUERY, {
      filter: Object.keys(treeFilter).length > 0 ? treeFilter : undefined,
      limit: 1000, // Adjust as needed
    });

    const trees = treesData.listTrees.items || [];
    console.log(`Found ${trees.length} trees to process`);

    if (trees.length === 0) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'No trees found to process',
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

      // Get RawData for this tree
      const rawDataResponse = await graphqlRequest(LIST_RAWDATA_QUERY, {
        filter: { treeRawDataId: { eq: tree.id } },
      });

      const rawDataItems = rawDataResponse.listRawData.items || [];
      
      // Filter for audio files
      const audioRawData = rawDataItems.filter(rd => isAudioS3Url(rd.valueString));
      console.log(`Found ${audioRawData.length} audio files for tree ${tree.id}`);

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

          // Download audio from S3
          const audioBuffer = await downloadAudioFromS3(audioRawDataItem.valueString);

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
