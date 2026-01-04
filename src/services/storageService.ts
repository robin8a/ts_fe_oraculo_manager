import { Storage } from '@aws-amplify/storage';
import amplifyconfig from '../amplifyconfiguration.json';

/**
 * Upload audio file to S3 using Amplify Storage
 */
export async function uploadAudioFile(
  file: File | Blob,
  treeId: string,
  featureName: string
): Promise<string> {
  try {
    // Generate unique file path
    const timestamp = Date.now();
    const extension = file instanceof File ? file.name.split('.').pop() || 'mp3' : 'mp3';
    const sanitizedFeatureName = featureName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${timestamp}.${extension}`;
    // Don't include 'public/' prefix - Amplify Storage adds it automatically when level is 'public'
    const key = `audio/${treeId}/${sanitizedFeatureName}/${fileName}`;

    console.log('Uploading to S3 with key:', key);
    console.log('File details:', {
      size: file.size,
      type: file instanceof File ? file.type : 'Blob',
      name: file instanceof File ? file.name : 'blob',
    });

    // Upload to S3 using Storage.put (Amplify v5 API)
    // Use 'protected' level for authenticated users (more secure)
    // Files are accessible to the authenticated user who uploaded them
    const result = await Storage.put(key, file, {
      contentType: file instanceof File ? file.type : 'audio/mpeg',
      level: 'protected', // Protected level requires authentication and is more secure
    });
    console.log('S3 upload result:', result);

    // Construct the S3 URL manually
    // Amplify Storage with level: 'protected' stores files under 'protected/{userId}/' prefix
    const bucketName = amplifyconfig.aws_user_files_s3_bucket;
    const region = amplifyconfig.aws_user_files_s3_bucket_region || amplifyconfig.aws_project_region;
    
    // Use the key from result if available, otherwise use our key
    // The result.key should already include the 'protected/{userId}/' prefix if Amplify added it
    const actualKey = result.key || key;
    // For protected level, Amplify adds 'protected/{userId}/' prefix
    // If it's not there, we need to construct it, but we don't have userId here
    // So we'll use the key as-is from the result
    const finalKey = actualKey;
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${finalKey}`;
    
    console.log('Constructed S3 URL:', s3Url);
    return s3Url;
  } catch (error: any) {
    // Log the full error object to understand the structure
    console.error('S3 upload error (full object):', error);
    console.error('S3 upload error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
      underlyingError: error.underlyingError,
      cause: error.cause,
    });
    
    // Check for specific error types
    const errorMessage = error.message || String(error);
    const is403 = error.statusCode === 403 || 
                  errorMessage.includes('403') || 
                  errorMessage.includes('Forbidden') ||
                  errorMessage.includes('Access Denied');
    
    if (is403) {
      throw new Error(
        `S3 upload permission denied (403). This usually means:\n\n` +
        `1. Authentication required: Amplify Storage uploads typically require authentication.\n` +
        `   - Sign in to your app before importing data\n` +
        `   - Or configure S3 bucket policy to allow unauthenticated writes\n\n` +
        `2. IAM permissions: The Cognito Identity Pool role needs s3:PutObject permission\n\n` +
        `3. Bucket policy: The S3 bucket must allow writes from your Cognito role\n\n` +
        `To fix: Configure the S3 bucket policy in AWS Console to allow writes from:\n` +
        `- Authenticated users (if using auth)\n` +
        `- Unauthenticated users (if not using auth)\n\n` +
        `Original error: ${errorMessage}\n` +
        `Error code: ${error.code || 'N/A'}\n` +
        `Status code: ${error.statusCode || 'N/A'}`
      );
    }
    
    throw new Error(`Failed to upload audio file: ${errorMessage}`);
  }
}

/**
 * Convert Blob to File for upload
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

/**
 * Check if a valueString is an S3 URL pointing to an audio file
 */
export function isAudioS3Url(valueString: string | null | undefined): boolean {
  if (!valueString || typeof valueString !== 'string') {
    return false;
  }

  // Check if it's an S3 URL
  const isS3Url = valueString.includes('.s3.') && valueString.includes('amazonaws.com');
  if (!isS3Url) {
    return false;
  }

  // Check if it points to an audio file by extension or path
  const lowerValue = valueString.toLowerCase();
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
  const hasAudioExtension = audioExtensions.some(ext => lowerValue.includes(ext));
  const hasAudioPath = lowerValue.includes('/audio/');

  return hasAudioExtension || hasAudioPath;
}

/**
 * Extract S3 key from S3 URL
 */
function extractS3KeyFromUrl(s3Url: string): string {
  try {
    const url = new URL(s3Url);
    // Remove leading slash from pathname
    return url.pathname.substring(1);
  } catch (error) {
    // Fallback: try to extract key manually
    const match = s3Url.match(/amazonaws\.com\/(.+)$/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error(`Unable to extract S3 key from URL: ${s3Url}`);
  }
}

/**
 * Download audio file from S3 using Amplify Storage
 */
export async function downloadAudioFileFromS3(s3Url: string): Promise<Blob> {
  try {
    // Extract the S3 key from the URL
    const s3Key = extractS3KeyFromUrl(s3Url);
    console.log('Downloading from S3 with key:', s3Key);

    // Determine the storage level based on the key
    // Protected files have 'protected/' prefix, public files have 'public/' prefix
    let level: 'protected' | 'public' = 'protected';
    let actualKey = s3Key;

    if (s3Key.startsWith('protected/')) {
      level = 'protected';
      // For protected files, we need to use the key without the 'protected/{userId}/' prefix
      // because Amplify Storage expects the key relative to the level
      actualKey = s3Key.replace(/^protected\/[^/]+\//, ''); // Remove 'protected/{userId}/'
    } else if (s3Key.startsWith('public/')) {
      level = 'public';
      actualKey = s3Key.replace(/^public\//, '');
    }

    console.log(`Downloading with level: ${level}, key: ${actualKey}`);

    // Method 1: Try fetching the S3 URL directly first (works for public files or if accessible)
    try {
      console.log('Attempting direct fetch of S3 URL:', s3Url);
      const directResponse = await fetch(s3Url, {
        method: 'GET',
        mode: 'cors',
      });

      if (directResponse.ok) {
        const blob = await directResponse.blob();
        if (blob && blob.size > 0) {
          console.log('Successfully downloaded file via direct fetch, size:', blob.size);
          return blob;
        }
      } else {
        console.log('Direct fetch failed with status:', directResponse.status);
      }
    } catch (directError: any) {
      console.log('Direct fetch failed, trying Storage.get():', directError.message);
    }

    // Method 2: Use Storage.get() with download option
    // This should work for protected files with proper authentication
    try {
      console.log('Attempting Storage.get() with download option...');
      const result = await Storage.get(actualKey, {
        level: level,
        download: true, // Request download as Blob
      });

      console.log('Storage.get() result type:', typeof result, result?.constructor?.name);

      // Handle different response formats
      const resultAny: any = result;
      
      // Case 1: Result is a Blob directly
      if (resultAny instanceof Blob) {
        console.log('Got Blob directly from Storage.get(), size:', resultAny.size);
        return resultAny;
      }

      // Case 2: Result has a Body property that is a Blob
      if (resultAny && typeof resultAny === 'object' && 'Body' in resultAny) {
        const body = resultAny.Body;
        if (body instanceof Blob) {
          console.log('Got Blob from Body property, size:', body.size);
          return body;
        }
        // If Body is ArrayBuffer, convert to Blob
        if (body instanceof ArrayBuffer) {
          console.log('Got ArrayBuffer from Body, converting to Blob');
          return new Blob([body], { type: 'audio/mpeg' });
        }
        // If Body is a string (base64), decode it
        if (typeof body === 'string') {
          try {
            console.log('Got base64 string from Body, decoding...');
            const binaryString = atob(body);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return new Blob([bytes], { type: 'audio/mpeg' });
          } catch (decodeError) {
            throw new Error('Failed to decode base64 audio data');
          }
        }
      }

      // Case 3: Result is ArrayBuffer
      if (resultAny instanceof ArrayBuffer) {
        console.log('Got ArrayBuffer directly, converting to Blob');
        return new Blob([resultAny], { type: 'audio/mpeg' });
      }

      // Case 4: Result might be a URL string (for public files)
      if (typeof resultAny === 'string' && resultAny.startsWith('http')) {
        console.log('Got URL string, fetching...');
        const urlResponse = await fetch(resultAny);
        if (urlResponse.ok) {
          return await urlResponse.blob();
        }
      }

      throw new Error('No file data received from S3 or unexpected format');
    } catch (storageError: any) {
      console.error('Storage.get() failed:', storageError);
      throw new Error(`Failed to download via Storage API: ${storageError.message || storageError}`);
    }
  } catch (error: any) {
    console.error('S3 download error:', error);
    const errorMessage = error.message || String(error);
    throw new Error(`Failed to download audio file from S3: ${errorMessage}`);
  }
}

