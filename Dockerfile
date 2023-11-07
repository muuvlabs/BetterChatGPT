# Builder stage
FROM node:alpine AS builder
ARG NODE_ENV=development
ENV PATH /home/appuser/.yarn/bin:$PATH

# Create app directory
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    mkdir -p /home/appuser/app && \
    chown appuser:appgroup /home/appuser/app

USER appuser
WORKDIR /home/appuser/app

# Install dependencies
COPY --chown=appuser:appgroup package.json yarn.lock ./
RUN yarn config set prefix ~/.yarn && \
    yarn install --frozen-lockfile

# Bundle app source
COPY --chown=appuser:appgroup . .

# Build static assets
RUN yarn build

# Serve stage
FROM node:alpine AS serve
RUN yarn global add serve && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    mkdir -p /home/appuser/app && \
    chown appuser:appgroup /home/appuser/app

USER appuser
WORKDIR /home/appuser/app

# Only copy the dist directory
COPY --from=builder /home/appuser/app/dist /home/appuser/app/dist

EXPOSE 3000
CMD ["serve", "-s", "/home/appuser/app/dist", "-l", "3000"]

