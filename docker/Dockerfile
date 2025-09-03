# docker/Dockerfile

FROM node:20-alpine

WORKDIR /home/node/app

RUN apk update && apk upgrade && apk add --no-cache bash

COPY ../package.json ../tsconfig.json ../yarn.lock ../.env ./

RUN yarn install

COPY ../src src/

CMD ["yarn", "start:dev"]
