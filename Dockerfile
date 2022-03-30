FROM node:latest
RUN mkdir -p /usr/src/shopit
WORKDIR /usr/src/shopit
COPY package.json /usr/src/shopit/
RUN npm install
COPY . /usr/src/shopit
USER node
EXPOSE 4000
CMD ["npm", "run", "dev"]