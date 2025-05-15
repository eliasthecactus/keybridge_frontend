#!/bin/sh

CERT_PATH="/etc/nginx/certs/keybridge.crt"
KEY_PATH="/etc/nginx/certs/keybridge.key"
ENV_FILE="/usr/share/nginx/html/env.js"

# Modify env.js dynamically so the frontend knows where to send the api requests to

if [ -n "$API_BASE_URL" ]; then
    echo "Updating env.js with API settings..."
    
    if [ -f "$ENV_FILE" ]; then
        echo "Setting API_BASE_URL to $API_BASE_URL"
        sed -i "s|apiUrl: .*|apiUrl: \"$API_BASE_URL\"|g" "$ENV_FILE"
    else
        echo "env.js not found! Creating a new one."
        echo "window.__env = { apiUrl: \"$API_BASE_URL\" }" > "$ENV_FILE"
    fi
fi



# Ensure API environment variables are set
if [ -z "$API_URL" ] || [ -z "$API_PORT" ]; then
    echo "API environment variables are not set, using standard configuration."
    
    if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
        echo "SSL certificates found, enabling HTTPS without API support..."
        cp /etc/nginx/nginx-https.conf /etc/nginx/conf.d/default.conf
    else
        echo "No SSL certificates found, running in HTTP mode without API support."
        cp /etc/nginx/nginx-http.conf /etc/nginx/conf.d/default.conf
    fi
    echo "Using the following configuration"
    cat /etc/nginx/conf.d/default.conf
    exec nginx -g "daemon off;"
    exit 0
fi

echo "API environment variables detected (API_URL=$API_URL, API_PORT=$API_PORT)."

# Ensure proxy_pass is formatted correctly
API_FULL_URL="${API_URL}:${API_PORT}"

# Replace placeholders in the Nginx configuration templates
if [ -f "/etc/nginx/nginx-http-api.conf" ]; then
    sed -i "s|{{API_URL}}:{{API_PORT}}|$API_FULL_URL|g" /etc/nginx/nginx-http-api.conf
fi

if [ -f "/etc/nginx/nginx-https-api.conf" ]; then
    sed -i "s|{{API_URL}}:{{API_PORT}}|$API_FULL_URL|g" /etc/nginx/nginx-https-api.conf
fi

# Choose the appropriate config file
if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
    echo "SSL certificates found, enabling HTTPS with API support..."
    cp /etc/nginx/nginx-https-api.conf /etc/nginx/conf.d/default.conf
else
    echo "No SSL certificates found, running in HTTP mode with API support."
    cp /etc/nginx/nginx-http-api.conf /etc/nginx/conf.d/default.conf
fi

echo "Using the following configuration"
cat /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"