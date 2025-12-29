# Testing Lambda Function URL

The Function URL is working (tested with curl), but the browser is getting "Failed to fetch".

## Quick Test in Browser Console

Open your browser console (F12) and run:

```javascript

```

This will show you the exact error.

## Common Issues

1. **CORS not enabled in AWS Console:**
   - Go to AWS Lambda Console
   - Find function: `kobotoolboxProxy-dev`
   - Configuration → Function URL
   - Enable CORS if not already enabled

2. **Browser blocking mixed content:**
   - If your app is on HTTPS but Function URL is HTTP (unlikely)
   - Or vice versa

3. **Network/firewall blocking:**
   - Check if your network/firewall allows requests to `*.lambda-url.us-east-1.on.aws`

## Enable CORS via AWS CLI

```bash
aws lambda update-function-url-config \
  --function-name kobotoolboxProxy-dev \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type","Authorization","X-Requested-With"],"MaxAge":86400}'

aws lambda update-function-url-config \
    --function-name kobotoolboxProxy-dev \
    --cors file://cors-config-no-options.json \
    --profile 879381245127_AdministratorAccess

```


## Verify Function URL Status

```bash
aws lambda get-function-url-config \
  --function-name kobotoolboxProxy-dev
```

Check that `Cors` is configured and `FunctionUrlStatus` is `ACTIVE`.

