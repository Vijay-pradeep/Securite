FROM nginx:alpine

# Copy nginx config that listens on 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your static site
COPY . /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
