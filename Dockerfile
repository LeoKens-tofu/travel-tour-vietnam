FROM node:22.18.0-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["yarn", "start"]
