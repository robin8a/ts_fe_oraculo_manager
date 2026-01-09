# Fixing S3 Upload 403 Forbidden Error

The 403 error occurs because the S3 bucket doesn't allow writes from your current IAM role/user.

## Solution 1: Configure S3 Bucket Policy (Recommended)

Update your S3 bucket policy to allow writes from the Cognito Identity Pool role.

### Steps:

1. **Find your Cognito Identity Pool ID:**
   - Check `src/aws-exports.js` or `amplifyconfiguration.json`
   - Look for `aws_cognito_identity_pool_id`

2. **Get the IAM Role ARN:**
   - Go to AWS Cognito Console → Identity Pools
   - Find your identity pool
   - Note the IAM roles for authenticated and unauthenticated users

3. **Update S3 Bucket Policy:**
   - Go to AWS S3 Console
   - Find your bucket: `tsbeoraculoapi17262dec3bf24508a7b8ab10175b638e755cb-dev`
   - Go to Permissions → Bucket Policy
   - Add or update the policy to allow `s3:PutObject`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCognitoUploads",
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::YOUR_ACCOUNT_ID:role/Cognito_YOUR_IDENTITY_POOL_ID_UnauthenticatedRole",
          "arn:aws:iam::YOUR_ACCOUNT_ID:role/Cognito_YOUR_IDENTITY_POOL_ID_AuthenticatedRole"
        ]
      },
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::tsbeoraculoapi17262dec3bf24508a7b8ab10175b638e755cb-dev/public/*"
    }
  ]
}
```

Replace:
- `YOUR_ACCOUNT_ID` with your AWS account ID
- `YOUR_IDENTITY_POOL_ID` with your Cognito Identity Pool ID

## Solution 2: Use Amplify CLI to Update Storage

Run this command to update the storage configuration:

```bash
amplify update storage
```

Select:
- Content (Images, audio, video, etc.)
- Select your existing storage resource
- Choose to allow guest access (if you want unauthenticated uploads)
- Or require authentication

Then run:
```bash
amplify push
```

## Solution 3: Ensure User is Authenticated

If your app requires authentication, make sure the user is signed in before importing data.

Add authentication check in your import hook:

```typescript
import { getCurrentUser } from 'aws-amplify/auth';

// Before upload
const user = await getCurrentUser();
if (!user) {
  throw new Error('Please sign in before importing data');
}
```

## Quick Test

After updating permissions, test the upload in browser console:

```javascript
import { Storage } from '@aws-amplify/storage';

const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
Storage.put('test/test.txt', testFile, { level: 'public' })
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

## Verify Current Configuration

Check your Amplify storage configuration:

```bash
amplify status
```

Look for the storage resource and verify its configuration.


