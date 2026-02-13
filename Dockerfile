FROM nginx:alpine

# Copy custom nginx config that listens on $PORT
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your static site files
COPY . /usr/share/nginx/html

# Cloud Run will inject PORT; default to 8080 for local use
ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
