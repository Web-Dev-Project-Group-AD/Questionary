# Questionary
A Project Work in Web Development – Advanced Concepts








The Dockerfile is actual in the gitignore.
The content from the Dockerfile:

FROM node:11.5.0

EXPOSE 8080
EXPOSE 9229

WORKDIR /web-application

COPY package*.json ./

RUN npm install

COPY src src

CMD ["npm", "run", "start"]
