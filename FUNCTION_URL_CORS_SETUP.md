# Lambda Function URL CORS Configuration

The Lambda Function URL is deployed, but it may need CORS to be enabled at the AWS level.

## Check CORS Configuration

1. **Go to AWS Lambda Console:**
   - Navigate to: https://console.aws.amazon.com/lambda/
   - Find function: `kobotoolboxProxy-dev`

2. **Check Function URL Configuration:**
   - Click on the function
   - Go to "Configuration" tab
   - Click on "Function URL"
   - Verify:
     - **CORS** is enabled
     - **Allow origin** is set to `*` or your domain
     - **Allow methods** includes `POST`, `OPTIONS`
     - **Allow headers** includes `Content-Type`, `Authorization`

## Enable CORS via AWS CLI

If CORS is not enabled, you can enable it:

```bash
aws lambda update-function-url-config \
  --function-name kobotoolboxProxy-dev \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type","Authorization","X-Requested-With"],"MaxAge":86400}'
```

## Alternative: Test Function URL Directly

Test if the Function URL is accessible:

```bash
curl -X POST https://ah5rtowwsvsmrnosm7rgjrejjm0redcf.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{"serverUrl":"kf.kobotoolbox.org","apiKey":"test","projectUid":"test","format":"json"}'
```

If this works from command line but not from browser, it's a CORS issue.

## Current Function URL

```
https://ah5rtowwsvsmrnosm7rgjrejjm0redcf.lambda-url.us-east-1.on.aws/
```

## Deploy Updated Lambda Code

After updating CORS settings, redeploy the Lambda function:

```bash
amplify push
```

This will deploy the updated Lambda code with improved CORS handling.



   aws profile 879381245127_AdministratorAccess lambda update-function-url-config \
     --function-name kobotoolboxProxy-dev \
     --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type","Authorization","X-Requested-With"],"MaxAge":86400}' 
