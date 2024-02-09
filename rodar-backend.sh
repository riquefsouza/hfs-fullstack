#/bin/bash

export SPRING_PROFILES_ACTIVE=development

export DATABASE_POSTGRESQL_USERNAME=postgres
export DATABASE_POSTGRESQL_PASSWORD=abcd1234
export DATABASE_POSTGRESQL_URL=localhost:5434

export KEYCLOAK_REALM=hfs-realm
export KEYCLOAK_HOST=http://localhost:8080

cd backend/hfs-backend

PROJECT_VERSION=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)

mvn -f pom.xml package -DskipTests

java -jar target/hfs-backend-${PROJECT_VERSION}.jar
