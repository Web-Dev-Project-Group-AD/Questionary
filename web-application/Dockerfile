FROM node:11.5.0

EXPOSE 8080
EXPOSE 9229

WORKDIR /web-application

COPY package*.json ./

RUN npm install

COPY src src

CMD ["npm", "run", "start"]
