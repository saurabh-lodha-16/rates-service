FROM node:14.16-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN cd /usr/src/app

RUN yarn install --loglevel error

COPY src/ /usr/src/app/src
COPY nest-cli.json /usr/src/app/nest-cli.json
COPY tsconfig.build.json /usr/src/app/tsconfig.build.json
COPY tsconfig.json /usr/src/app/tsconfig.json

RUN yarn run build

EXPOSE 3000
