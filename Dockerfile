FROM node:carbon-alpine

RUN mkdir /tmp/app
WORKDIR /tmp/app

COPY . .

RUN npm install --production

ENTRYPOINT [ "npm", "start" ]
