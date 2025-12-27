# Setting Up KoboToolbox Proxy Function

The Lambda function files have been created, but Amplify CLI needs to recognize it. Here are two options:

## Option 1: Add Function via Amplify CLI (Recommended)

Run these commands:

```bash
amplify add function
```

When prompted:
1. Select: **Lambda function (serverless function)**
2. Function name: **kobotoolboxProxy**
3. Runtime: **Node.js**
4. Template: **Hello World** (we'll replace it)
5. Configure advanced settings: **No** (or Yes if you want to customize)

After creation, **replace the generated `amplify/backend/function/kobotoolboxProxy/src/index.js`** with the KoboToolbox proxy code.

The proxy code has been restored in the file. It handles:
- CORS preflight requests
- Proxying requests to KoboToolbox API with authentication
- Handling both JSON/CSV data and binary audio files
- Returning proper CORS headers

Then run:
```bash
amplify push
```

## Option 2: Use CORS Browser Extension (Quick Testing)

For immediate development testing:

1. **Chrome**: Install "CORS Unblock" or "Allow CORS: Access-Control-Allow-Origin"
2. **Firefox**: Install "CORS Everywhere"
3. Enable the extension
4. Refresh your browser
5. Try the import again

**Note**: Extensions are for development only. For production, you must deploy the Lambda function.

## Current Function Location

The function code is already created at:
- `amplify/backend/function/kobotoolboxProxy/src/index.js`
- `amplify/backend/function/kobotoolboxProxy/cli-inputs.json`
- `amplify/backend/function/kobotoolboxProxy/package.json`

The function is also registered in:
- `amplify/backend/backend-config.json`

However, Amplify CLI may need to re-scan. Try running `amplify status` after adding via CLI.

