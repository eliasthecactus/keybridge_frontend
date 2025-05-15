# Stage 1: Build the Angular app
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the Angular project files
COPY . .

# Accept the API_URL as a build argument
ARG API_URL

# Replace the default API URL with the environment variable at runtime
RUN sed -i "s|http://127.0.0.1:2233|${API_URL}|g" public/env.js

# Build the Angular app for production
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:latest

# Copy the built Angular app to the Nginx HTML directory
COPY --from=build /app/dist/keybridge/browser /usr/share/nginx/html

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf


# Copy a custom Nginx config (optional)
COPY nginx-http.conf /etc/nginx/nginx-http.conf
COPY nginx-https.conf /etc/nginx/nginx-https.conf
COPY nginx-http-api.conf /etc/nginx/nginx-http-api.conf
COPY nginx-https-api.conf /etc/nginx/nginx-https-api.conf

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh


EXPOSE 80 443

# Start Nginx
CMD ["/docker-entrypoint.sh"]