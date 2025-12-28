# Adding Lambda Function as REST API Endpoint

The Lambda function `kobotoolboxProxy` is deployed but needs to be exposed as a REST API endpoint to be called from the frontend.

## Steps to Add REST API

1. **Add REST API:**
   ```bash
   amplify add api
   ```

2. **When prompted:**
   - Select: **REST**
   - Select: **Create new**
   - Path: **/proxy** (or any path you prefer)
   - Lambda function: **kobotoolboxProxy**
   - Method: **POST** (or **ANY** to allow all methods)
   - Authorization: **Open** (or configure as needed)

3. **Deploy:**
   ```bash
   amplify push
   ```

4. **Update API name in code:**
   After deployment, Amplify will create a REST API. The API name will be shown in the output. Update `src/services/koboToolboxApi.ts` to use the correct API name if it's different from `kobotoolboxProxy`.

## Alternative: Use Function URL (Simpler)

If you prefer not to use API Gateway, you can enable Function URL for the Lambda:

1. **Enable Function URL:**
   ```bash
   amplify update function
   ```
   - Select: **kobotoolboxProxy**
   - Select: **Configure function URL**
   - Enable: **Yes**
   - Authorization: **NONE** (or AWS_IAM if you want to secure it)

2. **Update code to use Function URL:**
   After enabling, you'll get a Function URL. Update `koboToolboxApi.ts` to call the Function URL directly instead of using `API.post()`.

## Current Status

- ✅ Lambda function code: `amplify/backend/function/kobotoolboxProxy/src/index.js`
- ✅ Lambda function deployed: Yes (in backend-config.json)
- ❌ REST API endpoint: Not configured
- ❌ Function URL: Not configured

Choose one of the options above to expose the Lambda function.

