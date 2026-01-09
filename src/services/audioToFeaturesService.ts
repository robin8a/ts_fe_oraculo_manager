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

// Lambda Function URL for tsAudioToFeatures
// The function is deployed as "tsAudioToFeatures"
// Set VITE_AUDIO_TO_FEATURES_FUNCTION_URL environment variable with the Function URL
// You can get the Function URL from AWS Lambda Console or by running:
// aws lambda get-function-url-config --function-name tsAudioToFeatures-dev
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
      'Lambda Function URL not configured. Please set VITE_AUDIO_TO_FEATURES_FUNCTION_URL environment variable with the Function URL for tsAudioToFeatures.\n\n' +
      'To get the Function URL:\n' +
      '1. Go to AWS Lambda Console\n' +
      '2. Find function: tsAudioToFeatures-dev (or tsAudioToFeatures-<env>)\n' +
      '3. Go to Configuration > Function URL\n' +
      '4. Copy the Function URL\n' +
      '5. Add to your .env file: VITE_AUDIO_TO_FEATURES_FUNCTION_URL=<your-function-url>'
    );
  }

  try {
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${errorText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        // Use text as-is if not JSON
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Handle Lambda response format
    if (result.statusCode) {
      if (result.statusCode === 200) {
        return JSON.parse(result.body);
      } else {
        const errorBody = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
        throw new Error(errorBody.error || `Lambda returned status ${result.statusCode}`);
      }
    }
    
    return result;
  } catch (error: any) {
    if (error.message && error.message.includes('Lambda Function URL')) {
      throw error;
    }
    throw new Error(`Failed to process audio to features: ${error.message}`);
  }
}
