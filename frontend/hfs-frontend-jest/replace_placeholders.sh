#!/bin/bash

#envsubst < /usr/share/nginx/html/environments/environment.prod.ts > /usr/share/nginx/html/environments/environment.ts
envsubst "\$BACKEND_HOST" < /temp/default.conf > /etc/nginx/conf.d/default.conf

exec "$@"