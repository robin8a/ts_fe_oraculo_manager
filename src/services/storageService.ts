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
    const key = `public/audio/${treeId}/${sanitizedFeatureName}/${fileName}`;

    // Upload to S3 using Storage.put (Amplify v5 API)
    await Storage.put(key, file, {
      contentType: file instanceof File ? file.type : 'audio/mpeg',
      level: 'public', // Use public level since bucket allows guest READ
    });

    // Construct the S3 URL from the bucket configuration
    const bucketName = amplifyconfig.aws_user_files_s3_bucket;
    const region = amplifyconfig.aws_user_files_s3_bucket_region || amplifyconfig.aws_project_region;
    
    // Construct the public S3 URL
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    
    return s3Url;
  } catch (error: any) {
    throw new Error(`Failed to upload audio file: ${error.message}`);
  }
}

/**
 * Convert Blob to File for upload
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

