FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Download OpenTelemetry agent
ENV OTEL_AGENT_VERSION="1.32.0"
RUN apt-get update && \
    apt-get install -y wget && \
    wget -O /app/opentelemetry-java-instrumentation.jar \
    https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v${OTEL_AGENT_VERSION}/opentelemetry-javaagent.jar && \
    ls -l /app/opentelemetry-java-instrumentation.jar

ENV PYTHON_SERVICE_URL=http://python-service:5000
ENV JAVA_TOOL_OPTIONS=-javaagent:/app/opentelemetry-java-instrumentation.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
