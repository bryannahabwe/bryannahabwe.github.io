# syntax=docker/dockerfile:1
# Static Astro build served by nginx. Used by the cognix server deploy
# (bryan.umbatech.com); GitHub Pages builds separately via .github/workflows/deploy.yml.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/container-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
