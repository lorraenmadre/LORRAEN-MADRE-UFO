# Mona Lisa Connect / LORRAEN MADRE UFO — container image.
# Works on Cloud Run, Render, Railway, Fly.io, or any container host.

FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
# tsx is a runtime dep (server.ts is executed with it), so a prod install is enough.
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server.ts ./
COPY firebase-applet-config.json ./
# The host injects PORT; server.ts reads process.env.PORT.
EXPOSE 8080
CMD ["npm", "start"]
