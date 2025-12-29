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

    // Upload to S3 using Storage.put (Amplify v5 API)
    const result = await Storage.put(key, file, {
      contentType: file instanceof File ? file.type : 'audio/mpeg',
      level: 'public', // Use public level - Amplify will add 'public/' prefix automatically
    });

    console.log('S3 upload result:', result);

    // Construct the S3 URL manually
    // Amplify Storage with level: 'public' stores files under 'public/' prefix
    const bucketName = amplifyconfig.aws_user_files_s3_bucket;
    const region = amplifyconfig.aws_user_files_s3_bucket_region || amplifyconfig.aws_project_region;
    
    // Use the key from result if available, otherwise use our key
    // The result.key should already include the 'public/' prefix if Amplify added it
    const actualKey = result.key || key;
    // Ensure we have the public prefix
    const finalKey = actualKey.startsWith('public/') ? actualKey : `public/${actualKey}`;
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${finalKey}`;
    
    console.log('Constructed S3 URL:', s3Url);
    return s3Url;
  } catch (error: any) {
    console.error('S3 upload error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
      key: key,
    });
    
    // Provide more helpful error message
    if (error.statusCode === 403 || error.message?.includes('403') || error.message?.includes('Forbidden')) {
      throw new Error(
        `S3 upload permission denied (403). Please verify:\n` +
        `1. The S3 bucket policy allows writes from your IAM role/user\n` +
        `2. You are authenticated (if required)\n` +
        `3. The bucket CORS configuration allows PUT requests\n\n` +
        `Original error: ${error.message}`
      );
    }
    
    throw new Error(`Failed to upload audio file: ${error.message}`);
  }
}

/**
 * Convert Blob to File for upload
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

