# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Accept build arguments
ARG NODE_ENV
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_NAVER_LOGIN_ENDPOINT

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_NAVER_LOGIN_ENDPOINT=$REACT_APP_NAVER_LOGIN_ENDPOINT

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
