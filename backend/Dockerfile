FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
RUN mkdir -p /hfsframework
WORKDIR /hfsframework
COPY hfsframework-spring-base/pom.xml /hfsframework
COPY hfsframework-spring-base/src /hfsframework/src
RUN mvn install -f pom.xml

RUN mkdir -p /workspace
WORKDIR /workspace
COPY hfs-backend/pom.xml /workspace
COPY hfs-backend/src /workspace/src
RUN mvn -f pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
COPY --from=build /workspace/target/*.jar hfs-backend.jar
EXPOSE 8000
ENTRYPOINT ["java","-jar","hfs-backend.jar"]
