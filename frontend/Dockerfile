### ESTAGIO 1: Build ###
FROM node:21.5-slim AS build
WORKDIR /home/node/app
COPY hfs-frontend/package-lock.json /home/node/app
COPY hfs-frontend/package.json /home/node/app
RUN npm ci
COPY hfs-frontend /home/node/app
RUN npm run build

### ESTAGIO 2: Run ###
FROM nginx:1.25.3-alpine
COPY hfs-frontend/default.conf /temp/default.conf
COPY hfs-frontend/replace_placeholders.sh /
COPY --from=build /home/node/app/dist/hfs-frontend /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "sh", "/replace_placeholders.sh" ]
CMD ["nginx",  "-g", "daemon off;"]
