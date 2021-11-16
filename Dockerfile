FROM node:16.3.0
RUN mkdir -p /usr/src/shopit
WORKDIR /usr/src/shopit
COPY package.json /usr/src/shopit/
RUN npm install
COPY . /usr/src/shopit
EXPOSE 4000
CMD ["npm", "run", "dev"]