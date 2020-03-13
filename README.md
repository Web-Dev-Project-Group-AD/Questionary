# Questionary
A Project Work in Web Development – Advanced Concepts








The Dockerfile is actual in the gitignore.


Dockerfile web-application:

FROM node:11.5.0

EXPOSE 8080
EXPOSE 9229

WORKDIR /web-application

COPY package*.json ./

RUN npm install

COPY src src

CMD ["npm", "run", "start"]


Dockerfile database:

FROM mysql:5.7.23

COPY initialize-database.sql /docker-entrypoint-initdb.d/


Dockerfile postgre:

FROM postgres:11.7

COPY initialize-postgres-db.sql /docker-entrypoint-initdb.d/


Dockerfile nginx:

FROM nginx:1.16.1

COPY spa /usr/share/nginx/html
