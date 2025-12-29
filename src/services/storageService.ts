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
      key: key,
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

