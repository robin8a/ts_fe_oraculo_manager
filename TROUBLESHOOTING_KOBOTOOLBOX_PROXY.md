# Troubleshooting kobotoolboxProxy Function URL Errors

## Common Error: "Failed to fetch data via Lambda: Network error: Cannot reach Lambda Function URL"

This error typically occurs when the Lambda Function URL is not accessible, CORS is not configured, or the Function URL has changed.

## Quick Diagnosis

### 1. Test in Browser Console

Open your browser's developer console (F12) and run:

```javascript
window.testKoboToolboxProxy()
```

This will run comprehensive tests and show you:
- Basic connectivity
- CORS preflight
- Valid request handling

### 2. Verify Function URL via AWS CLI

Run the verification script:

```bash
./scripts/verify-kobotoolbox-proxy.sh
```

Or manually check:

```bash
aws lambda get-function-url-config \
  --function-name kobotoolboxProxy-dev \
  --region us-east-1
```

## Common Issues and Solutions

### Issue 1: Function URL is Disabled

**Symptoms:**
- Error: "Failed to fetch"
- AWS CLI returns: "ResourceNotFoundException"

**Solution:**

Enable the Function URL:

```bash
aws lambda create-function-url-config \
  --function-name kobotoolboxProxy-dev \
  --auth-type NONE \
  --region us-east-1
```

Then update the URL in `src/services/koboToolboxApi.ts` or set the `VITE_KOBOTOOLBOX_PROXY_URL` environment variable.

### Issue 2: CORS Not Configured

**Symptoms:**
- Error: "Failed to fetch" in browser
- Works with curl but not from browser
- Browser console shows CORS error

**Solution:**

Enable CORS:

```bash
aws lambda update-function-url-config \
  --function-name kobotoolboxProxy-dev \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type","Authorization","X-Requested-With"],"MaxAge":86400}' \
  --region us-east-1
```

### Issue 3: Function URL Changed After Redeployment

**Symptoms:**
- Error: "Failed to fetch"
- Old URL returns 404 or HTML error page

**Solution:**

1. Get the current Function URL:

```bash
aws lambda get-function-url-config \
  --function-name kobotoolboxProxy-dev \
  --region us-east-1 \
  --query 'FunctionUrl' \
  --output text
```

2. Update the URL in one of these ways:

   **Option A: Update environment variable (Recommended)**
   
   Create or update `.env.local`:
   ```
   VITE_KOBOTOOLBOX_PROXY_URL=https://your-new-function-url.lambda-url.us-east-1.on.aws
   ```

   **Option B: Update hardcoded URL**
   
   Edit `src/services/koboToolboxApi.ts` and update the default URL.

### Issue 4: Network/Firewall Blocking

**Symptoms:**
- Error: "Failed to fetch"
- Works from some networks but not others
- Timeout errors

**Solution:**

1. Check if your network/firewall allows requests to `*.lambda-url.us-east-1.on.aws`
2. Try from a different network
3. Check browser extensions that might block CORS requests
4. Disable browser extensions temporarily to test

### Issue 5: Lambda Function Not Deployed

**Symptoms:**
- Error: "Failed to fetch"
- Function URL returns 404

**Solution:**

Redeploy the Lambda function:

```bash
amplify push
```

Or manually deploy:

```bash
cd amplify/backend/function/kobotoolboxProxy
npm install
cd ../../..
amplify push
```

## Verification Steps

After applying fixes, verify:

1. **Function URL is active:**
   ```bash
   aws lambda get-function-url-config \
     --function-name kobotoolboxProxy-dev \
     --region us-east-1 \
     --query 'FunctionUrlStatus' \
     --output text
   ```
   Should return: `ACTIVE`

2. **CORS is configured:**
   ```bash
   aws lambda get-function-url-config \
     --function-name kobotoolboxProxy-dev \
     --region us-east-1 \
     --query 'Cors' \
     --output json
   ```
   Should return CORS configuration JSON.

3. **Test from command line:**
   ```bash
   curl -X POST https://ah5rtowwsvsmrnosm7rgjrejjm0redcf.lambda-url.us-east-1.on.aws/ \
     -H "Content-Type: application/json" \
     -d '{"serverUrl":"kf.kobotoolbox.org","apiKey":"test","projectUid":"test","format":"json"}'
   ```

4. **Test from browser console:**
   ```javascript
   window.testKoboToolboxProxy()
   ```

## Environment Variables

You can override the Function URL using environment variables:

- **Development:** Create `.env.local`:
  ```
  VITE_KOBOTOOLBOX_PROXY_URL=https://your-function-url.lambda-url.us-east-1.on.aws
  ```

- **Production:** Set in your hosting platform's environment variables.

## Getting Help

If the issue persists:

1. Check AWS CloudWatch Logs for the Lambda function
2. Run the diagnostic script: `./scripts/verify-kobotoolbox-proxy.sh`
3. Test in browser console: `window.testKoboToolboxProxy()`
4. Check browser network tab for detailed error information
