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
# file://wsl.localhost/Ubuntu-22.04/home/hfs/hfs-fullstack/frontend/coverage/html/index.html

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
