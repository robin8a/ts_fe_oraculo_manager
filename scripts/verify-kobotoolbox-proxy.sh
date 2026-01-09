#!/bin/bash

# Script to verify kobotoolboxProxy Lambda Function URL configuration
# This script checks if the Function URL is enabled and CORS is configured

FUNCTION_NAME="kobotoolboxProxy-dev"
REGION="us-east-1"

echo "========================================="
echo "Verifying kobotoolboxProxy Function URL"
echo "========================================="
echo ""

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Get Function URL configuration
echo "1. Checking Function URL configuration..."
FUNCTION_URL_CONFIG=$(aws lambda get-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Failed to get Function URL configuration"
    echo "Error: $FUNCTION_URL_CONFIG"
    echo ""
    echo "Possible reasons:"
    echo "  - Function URL is not enabled"
    echo "  - Function name is incorrect: $FUNCTION_NAME"
    echo "  - AWS credentials are not configured"
    echo "  - Region is incorrect: $REGION"
    echo ""
    echo "To enable Function URL, run:"
    echo "  aws lambda create-function-url-config \\"
    echo "    --function-name $FUNCTION_NAME \\"
    echo "    --auth-type NONE \\"
    echo "    --region $REGION"
    exit 1
fi

# Extract Function URL
FUNCTION_URL=$(echo "$FUNCTION_URL_CONFIG" | grep -oP '"FunctionUrl":\s*"\K[^"]*' || echo "")
CORS_CONFIG=$(echo "$FUNCTION_URL_CONFIG" | grep -A 10 '"Cors":' || echo "No CORS configuration")

echo "✓ Function URL found:"
echo "  $FUNCTION_URL"
echo ""

# Check CORS configuration
echo "2. Checking CORS configuration..."
if echo "$FUNCTION_URL_CONFIG" | grep -q '"Cors":'; then
    echo "✓ CORS is configured"
    echo "$CORS_CONFIG" | head -10
else
    echo "❌ CORS is NOT configured"
    echo ""
    echo "To enable CORS, run:"
    echo "  aws lambda update-function-url-config \\"
    echo "    --function-name $FUNCTION_NAME \\"
    echo "    --cors '{\"AllowOrigins\":[\"*\"],\"AllowMethods\":[\"POST\",\"OPTIONS\"],\"AllowHeaders\":[\"Content-Type\",\"Authorization\",\"X-Requested-With\"],\"MaxAge\":86400}' \\"
    echo "    --region $REGION"
fi
echo ""

# Test Function URL connectivity
echo "3. Testing Function URL connectivity..."
if [ -n "$FUNCTION_URL" ]; then
    TEST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$FUNCTION_URL" \
        -H "Content-Type: application/json" \
        -d '{"test":"connectivity"}' \
        --max-time 10 2>&1)
    
    if [ "$TEST_RESPONSE" = "200" ] || [ "$TEST_RESPONSE" = "400" ]; then
        echo "✓ Function URL is accessible (HTTP $TEST_RESPONSE)"
        echo "  Note: 400 is expected for test requests without valid parameters"
    else
        echo "⚠ Function URL returned HTTP $TEST_RESPONSE"
        echo "  This may indicate an issue with the function or CORS"
    fi
else
    echo "⚠ Cannot test connectivity - Function URL not found"
fi
echo ""

# Check if Function URL matches the one in code
echo "4. Verifying Function URL in code..."
EXPECTED_URL="https://ah5rtowwsvsmrnosm7rgjrejjm0redcf.lambda-url.us-east-1.on.aws"
if [ "$FUNCTION_URL" = "$EXPECTED_URL" ]; then
    echo "✓ Function URL matches the one in code"
else
    echo "⚠ Function URL does NOT match the one in code!"
    echo "  Expected: $EXPECTED_URL"
    echo "  Actual:   $FUNCTION_URL"
    echo ""
    echo "  You need to update src/services/koboToolboxApi.ts with the new URL"
    echo "  Or set the VITE_KOBOTOOLBOX_PROXY_URL environment variable"
fi
echo ""

echo "========================================="
echo "Verification complete"
echo "========================================="
