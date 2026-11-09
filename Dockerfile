# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the production build using Nginx (OpenShift compatible)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configure directory permissions for OpenShift non-root container execution
RUN touch /var/run/nginx.pid && \
    chmod -R 777 /var/run/nginx.pid /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

EXPOSE 8080
USER 1001

CMD ["nginx", "-g", "daemon off;"]
