npm install -g @angular/cli

# HFS FULLSTACK

ng serve

ng serve --host=0.0.0.0

ng generate component component-name

ng generate directive|pipe|service|class|guard|interface|enum|module

ng build

ng test
# abrir no navegador o karma e o resultado do coverage = true no arquivo a angular.json
# http://localhost:9876/ 
# file://wsl.localhost/Ubuntu-22.04/home/hfs/hfs/frontend/__coverage_karma/html/index.html

ng test --no-watch --code-coverage

ng help


npm install -g npm@latest

npm install @types/node

npm install keycloak-angular keycloak-js

npm install --save jspdf
npm install --save jspdf-autotable
npm install --save xlsx
npm install --save file-saver
npm install --save @types/file-saver

npm install @ngx-translate/core
npm install @ngx-translate/http-loader

ng g class keycloak/keycloak-init --type=factory --skip-tests
ng g guard keycloak/auth --skip-tests

npm install karma-coverage-istanbul-reporter --save-dev

# comandos docker
docker container ls -a
docker compose up -d
docker compose down
docker compose exec app bash



npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter @types/jasmine karma-coverage-istanbul-reporter jasmine-core

rm karma.conf.js
rm src/test.ts


npm install --save-dev jest jest-preset-angular @types/jest @angular-builders/jest

npm install --save-dev @testing-library/angular

npm install --save-dev canvas

file://wsl.localhost/Ubuntu-22.04/home/hfs/hfs/frontend/__coverage_jest/lcov-report/index.html



"test": "jest",
"test:watch": "jest --watch",

"test:ci": "jest --runInBand",

npm i -g jest-cli