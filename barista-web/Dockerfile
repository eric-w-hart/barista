ARG REPO=""
ARG TAG=compose

#FROM ${REPO}barista-base:${TAG}
FROM node:12.16.3-alpine AS builder
ARG BARISTA_VERSION=unspecified
# This argument is passed and used by yarn to set up the environment...
# It is the setting which tells the browser where to contact the API server.
ARG BARISTA_API_BASE_PATH=/api/v1

# Create app directory
WORKDIR /usr/src/app
ENV HOME=/usr/src/app

RUN mkdir -p /usr/src/app && cd /usr/src/app
WORKDIR /usr/src/app

RUN cp docker/node-conf/npmrc .npmrc && cp docker/node-conf/yarnrc .yarnrc 

COPY yarn.lock /usr/src/app/

# show the two registry configs.
RUN npm config ls -l && yarn config get registry

# do the initial npm install so it can be cached later
COPY package.json /usr/src/app/
RUN   npm install

RUN mkdir -p -v -m 770 .config /.config /.cache/yarn  && chown root:root /.cache /.cache/yarn /.config .config\
    && chmod -R g+rw . && chmod -R g+rwx .config /.config

COPY . /usr/src/app/
RUN npm install
RUN   yarn run build:prod

#RUN chmod g+rw . *

FROM  node:12.16.3-alpine

WORKDIR /usr/src/app
ENV HOME=/usr/src/app

RUN apk add nginx bash
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder    /usr/src/app/dist/barista-web/* /usr/share/nginx/html/
COPY  docker/nginx-conf/nginx.conf /etc/nginx/
RUN  rm -fr /etc/nginx/conf.d/*  \
     &&   chgrp -R root /usr/share/nginx/html/* /var/log/nginx \
     && chmod -R 777  /usr/share/nginx/html /var/lib/nginx /var/log/nginx /var/lib/nginx /run
USER 1011

STOPSIGNAL SIGTERM
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
