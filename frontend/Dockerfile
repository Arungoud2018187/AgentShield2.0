FROM nginx:alpine

ENV PORT=80 \
    BACKEND_HOST=127.0.0.1 \
    BACKEND_PORT=8000

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy production build assets
COPY dist /usr/share/nginx/html

# Copy template for dynamic environment variable substitution
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
