# Сборка
FROM node:20.19.2 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Создаем конфигурацию Nginx с поддержкой SPA
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose the port Nginx is listening on
EXPOSE 80
# Nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]
