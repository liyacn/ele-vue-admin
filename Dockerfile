FROM node:18-alpine as builder
ARG env=prod
WORKDIR /build
COPY . .
RUN npm install --registry=https://registry.npmmirror.com && npm run build:${env}

FROM nginx:1.25
COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=builder /build/dist www
ENTRYPOINT ["nginx", "-g", "daemon off;"] 
