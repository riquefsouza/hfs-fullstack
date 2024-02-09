# Executar antes de rodar o sonarqube
sudo sysctl -w vm.max_map_count=524288
sudo sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192

# JACOCO BACKEND COVERAGE
# abrir no navegador
mvn -f pom.xml package
file://wsl.localhost/Ubuntu-22.04/home/hfs/hfsfullstack/backend/hfs-backend/target/site/jacoco/index.html

# USAR O SONARQUBE
# acessar a página do sonarqube com o user = admin e senha = abcd1234
# ir para --> User > My Account > Security
# Gerar um token para a user-account em SonarQube
# Expor o token como variavel de ambiente
# export SONAR_TOKEN="<your_token>" (bash/GitBash)
# SET SONAR_TOKEN="<your_token>" (bat/Windows)

# SONAR_TOKEN = squ_bc7742415025073aaee89165ef3448221f9ed4c9

# mvn ... sonar:sonar -Dsonar.token=$SONAR_TOKEN (bash/GitBash)
# mvn ... sonar:sonar -Dsonar.token=%SONAR_TOKEN% (bat/Windows)

export SONAR_TOKEN="squ_bc7742415025073aaee89165ef3448221f9ed4c9"
echo $SONAR_TOKEN
mvn sonar:sonar -Dsonar.token=$SONAR_TOKEN
# -Dsonar.scm.provider=git


# motrar todo o log
mvn -X sonar:sonar
