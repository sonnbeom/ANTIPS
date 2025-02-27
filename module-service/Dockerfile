#FROM openjdk:17
#ARG JAR_FILE=build/libs/module-service.jar
#COPY ${JAR_FILE} app.jar
#ENTRYPOINT ["java","-jar","/app.jar"]
FROM openjdk:17
ARG JAR_FILE=build/libs/module-service.jar

# UTF-8 환경 설정 추가
ENV LANG=ko_KR.UTF-8
ENV LANGUAGE=ko_KR:ko
ENV LC_ALL=ko_KR.UTF-8

COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-jar", "/app.jar"]
