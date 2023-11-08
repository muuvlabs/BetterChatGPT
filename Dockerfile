# Builder stage
FROM node:alpine AS builder

# Make sure devDependencies are installed (needed for tsc). Don't update/override it.
ARG NODE_ENV=development

# Using REAL_ENV so that it uses the right values for prod/staging. Must be overridden.
ARG REAL_ENV=development

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
RUN cp .vi-env.${REAL_ENV} .env.${REAL_ENV} && \
    yarn build --mode $REAL_ENV

# Serve stage
FROM nginx:alpine
COPY --from=builder /home/appuser/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
