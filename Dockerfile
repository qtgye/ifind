# https://github.com/nodejs/docker-node/tree/e75fa5270326ffaff8fee03153f3bf16860084d4/14/bullseye-slim
FROM didstopia/base:nodejs-14-ubuntu-20.04

# Install global dependencies
RUN npm install pm2 -g

# Copy directories and files
COPY ./ifind-icons /ifind-icons
COPY ./admin /admin/
COPY ./web/ /app/
COPY ./docker.ecosystem.config.js /docker.ecosystem.config.js

WORKDIR /

CMD ["pm2-runtime", "docker.ecosystem.config.js"]
