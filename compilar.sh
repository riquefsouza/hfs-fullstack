#/bin/bash

cd backend/hfsframework-spring-base
mvn -f pom.xml clean install -DskipTests

cd ../../
cd backend/hfs-backend
mvn -f pom.xml clean package -DskipTests

cd ../../
cd frontend/hfs-frontend
npm install

cd ../../
cd frontend/hfs-frontend-jest
npm install

cd ../../
cd frontend/hfs-frontend-material
npm install

cd ../../
cd frontend/hfs-frontend-react-next
npm install

cd ../../
cd frontend/hfs-frontend-react
npm install

cd ../../
cd frontend/hfs-frontend-react-mui
npm install

cd ../../
cd frontend/hfs-frontend-vue
npm install

cd ../../
cd frontend/hfs-frontend-vuetify
npm install
