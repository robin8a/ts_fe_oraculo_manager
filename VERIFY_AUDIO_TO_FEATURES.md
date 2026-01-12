# Verify audioToFeatures Lambda Function Deployment

## Step 1: Verify Environment Variables

Check that the required environment variables are set in your Lambda function:

```bash
# Replace 'dev' with your Amplify environment name if different
aws lambda get-function-configuration \
  --function-name audioToFeatures-dev \
  --region us-east-1 \
  --query 'Environment.Variables' \
  --output json
```

**Expected output should include:**
- `API_TSBEORACULOAPI_GRAPHQLAPIENDPOINTOUTPUT` - Should have a GraphQL endpoint URL
- `API_TSBEORACULOAPI_GRAPHQLAPIKEYOUTPUT` - Should have an API key
- `STORAGE_S3744E127B_BUCKETNAME` - Should have an S3 bucket name
- `ENV` - Your environment name
- `REGION` - AWS region (e.g., us-east-1)

**If any are missing or empty:**
The CloudFormation template parameters might not be getting passed correctly. Check the Amplify deployment logs or manually set them via AWS Console.

## Step 2: Check CloudWatch Logs

View recent logs to see if the function is working:

```bash
# Get the log group name
aws logs describe-log-groups \
  --log-group-name-prefix "/aws/lambda/audioToFeatures" \
  --region us-east-1

# View recent logs (replace with actual log group name)
aws logs tail /aws/lambda/audioToFeatures-dev \
  --follow \
  --region us-east-1
```

Look for:
- Any errors about missing environment variables
- Successful function invocations
- Any runtime errors

## Step 3: Test the Function

### Option A: Test via AWS Console
1. Go to AWS Lambda Console
2. Find your `audioToFeatures` function
3. Click "Test" tab
4. Create a test event with:
```json
{
  "body": "{\"templateId\":\"your-template-id\",\"geminiApiKey\":\"your-gemini-key\"}"
}
```

### Option B: Test via Function URL (if configured)
```bash
# Get the Function URL
aws lambda get-function-url-config \
  --function-name audioToFeatures-dev \
  --region us-east-1 \
  --query 'FunctionUrl' \
  --output text

# Test with curl
curl -X POST https://YOUR-FUNCTION-URL \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "your-template-id",
    "geminiApiKey": "your-gemini-key"
  }'
```

### Option C: Test from Your Frontend
1. Make sure `VITE_AUDIO_TO_FEATURES_FUNCTION_URL` is set in your `.env.local` or environment
2. Try using the AudioToFeatures feature in your app
3. Check the browser console for errors

## Step 4: Verify Parameter Names (If Environment Variables Are Still Missing)

If the environment variables are still missing after `amplify push`, the parameter names in the CloudFormation template might not match what Amplify is passing. 

Check what parameters Amplify is actually passing:

1. Go to AWS CloudFormation Console
2. Find your `amplify-*-audioToFeatures-*` stack
3. Check the "Parameters" tab to see what values are being passed
4. Compare with the parameter names in `audioToFeatures-cloudformation-template.json`

If they don't match, update the template parameter names to match what Amplify is passing.

## Common Issues

### Issue 1: Parameters Not Being Passed
**Symptom:** Environment variables are empty or missing

**Solution:** 
- Check that `cli-inputs.json` has the correct `dependsOn` configuration
- Verify the resource names match exactly (case-sensitive)
- Try manually setting environment variables in the AWS Console as a temporary workaround

### Issue 2: Parameter Names Don't Match
**Symptom:** Environment variables exist but have different names

**Solution:**
- Check CloudFormation stack parameters
- Update the template to use the correct parameter names
- Or update the Lambda code to use the actual environment variable names

### Issue 3: Function URL Changed
**Symptom:** Frontend can't reach the function

**Solution:**
- Get the new Function URL from AWS Console or CLI
- Update `VITE_AUDIO_TO_FEATURES_FUNCTION_URL` in your `.env.local` file

## Quick Verification Script

Save this as `verify-audio-to-features.sh`:

```bash
#!/bin/bash

FUNCTION_NAME="audioToFeatures-dev"
REGION="us-east-1"

echo "Checking Lambda function configuration..."
echo ""

# Check environment variables
echo "Environment Variables:"
aws lambda get-function-configuration \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --query 'Environment.Variables' \
  --output json

echo ""
echo "Checking for required variables..."
ENV_VARS=$(aws lambda get-function-configuration \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --query 'Environment.Variables' \
  --output json)

if echo "$ENV_VARS" | grep -q "API_TSBEORACULOAPI_GRAPHQLAPIENDPOINTOUTPUT"; then
  echo "✓ GRAPHQL_ENDPOINT is set"
else
  echo "✗ GRAPHQL_ENDPOINT is missing"
fi

if echo "$ENV_VARS" | grep -q "API_TSBEORACULOAPI_GRAPHQLAPIKEYOUTPUT"; then
  echo "✓ GRAPHQL_API_KEY is set"
else
  echo "✗ GRAPHQL_API_KEY is missing"
fi

if echo "$ENV_VARS" | grep -q "STORAGE_S3744E127B_BUCKETNAME"; then
  echo "✓ S3_BUCKET is set"
else
  echo "✗ S3_BUCKET is missing"
fi
```

Make it executable and run:
```bash
chmod +x verify-audio-to-features.sh
./verify-audio-to-features.sh
```
