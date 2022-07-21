# TODO: change this to a production file
FROM node:lts-alpine
RUN mkdir -p /usr/src/shopit
WORKDIR /usr/src/shopit
COPY package.json /usr/src/shopit/
RUN npm install
COPY . /usr/src/shopit
USER node
EXPOSE 4000
