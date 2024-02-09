cd C:\Program Files\Google\Chrome\Application
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security 

# corrigir erro de checksum do liquibase
update DATABASECHANGELOG set MD5SUM = '9:b8d59d9fea4e52b46baa84481a7e8f63'
where MD5SUM = '9:0cec4b0ae9591dd7500b025a0b7eb22b';


Adicionar no arquivo do windows --> C:\Windows\System32\drivers\etc\hosts

127.0.0.1	keycloak
127.0.0.1	postgresdocker


http://localhost:8000/actuator

http://localhost:8000/actuator/prometheus

http://localhost:8000/actuator/metrics

http://localhost:8000/actuator/health


mvn liquibase:generateChangeLog
mvn liquibase:update
mvn liquibase:rollback -Dliquibase.rollbackCount=1


mvn -f pom.xml clean package -DskipTests

mvn -f pom.xml clean test
mvn -f pom.xml package

docker build -t backend-backend .
