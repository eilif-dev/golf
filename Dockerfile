FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
RUN npm install -g sirv-cli
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["sirv", "dist", "--host", "0.0.0.0", "--port", "3000", "--single"]
