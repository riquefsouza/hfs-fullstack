docker-compose up -d frontend
docker ps
docker logs keycloak

# this one will run only Prometheus and Grafana
docker-compose up -d grafana

# Descobrir as portas abertas
sudo lsof -i -P -n | grep LISTEN

# Prometheus 
http://localhost:5000

http://localhost:5000/flags
http://localhost:5000/config

# executar a query e ver se os dados estão chegando:
http_server_requests_seconds_count{job="spring_micrometer"}

# Grafana 
http://localhost:3000

user: admin
password: admin

# KEYCLOAK
http://keycloak:8080/

# HFS-BACKEND
# executar 
# mvn -f pom.xml clean package -DskipTests
http://localhost:8000/swagger-ui/index.html

# HFS-FRONTEND
# executar 
# npm start
http://localhost:4200/

# KARMA TEST FRONTEND
# executar 
# npm test
http://localhost:9876/

# KARMA FRONTEND COVERAGE
# abrir no navegador o karma e o resultado do coverage = true no arquivo a angular.json
file://wsl.localhost/Ubuntu-22.04/home/hfs/hfs-fullstack/frontend/__coverage_karma/html/index.html

# JEST FRONTEND COVERAGE
file://wsl.localhost/Ubuntu-22.04/home/hfs/hfs-fullstack/frontend/__coverage_jest/lcov-report/index.html

# Executar antes de rodar o sonarqube
sudo sysctl -w vm.max_map_count=524288
sudo sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192

# JACOCO BACKEND COVERAGE
# abrir no navegador
mvn -f pom.xml package
file://wsl.localhost/Ubuntu-22.04/home/hfs/hfs-fullstack/backend/hfs-backend/target/site/jacoco/index.html

# SONARQUBE 
http://localhost:9000

user: admin
password: abcd1234

# USAR O SONARQUBE
# acessar a página do sonarqube com o user = admin e senha = abcd1234
# ir para --> User > My Account > Security
# Gerar um token para a user-account em SonarQube
# Expor o token como variavel de ambiente
# export SONAR_TOKEN="<your_token>" (bash/GitBash)
# SET SONAR_TOKEN="<your_token>" (bat/Windows)

# SONAR_TOKEN = squ_daccac570842c37c51bd3a6624b20e72f71cc30a

# mvn ... sonar:sonar -Dsonar.token=$SONAR_TOKEN (bash/GitBash)
# mvn ... sonar:sonar -Dsonar.token=%SONAR_TOKEN% (bat/Windows)

export SONAR_TOKEN="squ_daccac570842c37c51bd3a6624b20e72f71cc30a"
echo $SONAR_TOKEN
mvn sonar:sonar -Dsonar.token=$SONAR_TOKEN
# -Dsonar.scm.provider=git


# motrar todo o log
mvn -X sonar:sonar

cd C:\Program Files\Google\Chrome\Application
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

# GITLAB
http://localhost:8929

username = root
password = 5iveL!fe

mkdir teste
cd teste
git clone http://localhost:8929/disad/hfs.git
