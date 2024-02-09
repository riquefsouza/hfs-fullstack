#/bin/bash

export KEYCLOAK_HOST=http://localhost:8080
export KEYCLOAK_REALM=hfs-realm
export KEYCLOAK_CLIENT=hfs-frontend

export BACKEND_HOST=http://localhost:8000

cd frontend/hfs-frontend

npm install 

npm start
