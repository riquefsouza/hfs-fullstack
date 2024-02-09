docker compose up
docker compose down
docker compose exec db bash
mysql -uroot -proot
show databases;
use keycloak;


https://jwt.io/


sudo ln -s "/mnt/c/Users/hfs30/AppData/Local/Programs/Microsoft VS Code/bin/code" /usr/bin/code

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=${PATH}:${JAVA_HOME}/bin

echo 'export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"' >> ~/.bash_profile
echo 'export PATH="${PATH}:${JAVA_HOME}/bin"' >> ~/.bash_profile

ou

echo 'export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"' >> ~/.zprofile
echo 'export PATH="${PATH}:${JAVA_HOME}/bin"' >> ~/.zprofile




nvm ls 
nvm alias default 21.5.0
nvm use 21.5.0

npm install -g npm@latest
