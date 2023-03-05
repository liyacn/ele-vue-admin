FROM node:24-alpine AS builder
ARG env=prod
WORKDIR /build
COPY . .
RUN npm install --registry=https://registry.npmmirror.com && npm run build:${env}

FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=builder /build/dist /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
