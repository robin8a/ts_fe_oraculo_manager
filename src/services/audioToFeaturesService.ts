export interface ProcessAudioToFeaturesParams {
  treeIds?: string[];
  templateId: string;
  geminiApiKey: string;
}

export interface TreeProcessingResult {
  treeId: string;
  treeName: string;
  audioCount: number;
  processed: number;
  errors: string[];
  featuresExtracted: number;
}

export interface ProcessAudioToFeaturesResponse {
  success: boolean;
  message: string;
  results: TreeProcessingResult[];
  summary: {
    totalTrees: number;
    totalAudioFiles: number;
    totalProcessed: number;
    totalErrors: number;
    totalFeaturesExtracted: number;
  };
}

// Lambda Function URL for audioToFeatures
// This will be set after deployment via environment variable or manually
const getFunctionUrl = () => {
  const url = import.meta.env.VITE_AUDIO_TO_FEATURES_FUNCTION_URL || '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const LAMBDA_FUNCTION_URL = getFunctionUrl();

/**
 * Process audio files to extract features using Gemini API
 */
export async function processAudioToFeatures(
  params: ProcessAudioToFeaturesParams
): Promise<ProcessAudioToFeaturesResponse> {
  if (!LAMBDA_FUNCTION_URL) {
    throw new Error(
      'Lambda Function URL not configured. Please set VITE_AUDIO_TO_FEATURES_FUNCTION_URL environment variable or configure the function URL.'
    );
  }

  try {
    // Build request body, omitting treeIds if undefined
    const requestBody: any = {
      templateId: params.templateId,
      geminiApiKey: params.geminiApiKey,
    };
    
    // Only include treeIds if it's defined and is an array
    if (params.treeIds && Array.isArray(params.treeIds) && params.treeIds.length > 0) {
      requestBody.treeIds = params.treeIds;
    }

    console.log('AudioToFeatures Service: Calling lambda with params:', {
      templateId: requestBody.templateId,
      treeIds: requestBody.treeIds || 'all trees (omitted)',
      treeIdsCount: requestBody.treeIds?.length || 'N/A',
      hasGeminiKey: !!requestBody.geminiApiKey,
    });

    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('AudioToFeatures Service: Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${errorText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        // Use text as-is if not JSON
      }
      
      console.error('AudioToFeatures Service: Error response:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('AudioToFeatures Service: Raw response:', result);
    
    // Handle Lambda response format
    let finalResult: ProcessAudioToFeaturesResponse;
    
    if (result.statusCode) {
      if (result.statusCode === 200) {
        const parsedBody = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
        console.log('AudioToFeatures Service: Parsed response body:', parsedBody);
        finalResult = parsedBody;
      } else {
        const errorBody = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
        console.error('AudioToFeatures Service: Lambda error:', errorBody);
        throw new Error(errorBody.error || `Lambda returned status ${result.statusCode}`);
      }
    } else {
      console.log('AudioToFeatures Service: Direct response (no statusCode):', result);
      finalResult = result;
    }
    
    // Validate response structure
    if (!finalResult || typeof finalResult !== 'object') {
      console.error('AudioToFeatures Service: Invalid response structure:', finalResult);
      throw new Error('Invalid response format from lambda function');
    }
    
    // Ensure summary exists
    if (!finalResult.summary) {
      console.warn('AudioToFeatures Service: Response missing summary, creating default');
      finalResult.summary = {
        totalTrees: finalResult.results?.length || 0,
        totalAudioFiles: 0,
        totalProcessed: 0,
        totalErrors: 0,
        totalFeaturesExtracted: 0,
      };
    }
    
    // Ensure results array exists
    if (!Array.isArray(finalResult.results)) {
      console.warn('AudioToFeatures Service: Response missing results array, creating empty array');
      finalResult.results = [];
    }
    
    console.log('AudioToFeatures Service: Final processed result:', {
      success: finalResult.success,
      totalFeaturesExtracted: finalResult.summary.totalFeaturesExtracted,
      totalTrees: finalResult.summary.totalTrees,
      resultsCount: finalResult.results.length,
    });
    
    return finalResult;
  } catch (error: any) {
    console.error('AudioToFeatures Service: Exception:', error);
    if (error.message && error.message.includes('Lambda Function URL')) {
      throw error;
    }
    throw new Error(`Failed to process audio to features: ${error.message}`);
  }
}
