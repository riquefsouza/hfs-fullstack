#/bin/bash

cd backend/hfsframework-spring-base
mvn -f pom.xml clean

cd ../../
cd backend/hfs-backend
mvn -f pom.xml clean

cd ../../
cd frontend
rm -r __coverage_karma/
rm -r __coverage_jest/

cd ../
cd frontend/hfs-frontend
rm -r .angular/
rm -r node_modules/
rm -r dist/

cd ../../
cd frontend/hfs-frontend-jest
rm -r .angular/
rm -r node_modules/
rm -r dist/

cd ../../
cd frontend/hfs-frontend-material
rm -r .angular/
rm -r node_modules/
rm -r dist/

cd ../../
cd frontend/hfs-frontend-react-next
rm -r .next/
rm -r node_modules/
rm -r dist/

cd ../../
cd frontend/hfs-frontend-react
rm -r node_modules/
rm -r dist/

cd ../../
cd frontend/hfs-frontend-react-mui
rm -r node_modules/
rm -r dist/

cd ../../
cd frontend/hfs-frontend-vue
rm -r node_modules/
rm -r dist/
