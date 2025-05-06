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

ADD https://github.com/grafana/pyroscope-java/releases/download/v0.12.2/pyroscope.jar ./pyroscope.jar
ADD https://repo1.maven.org/maven2/io/pyroscope/otel/0.10.1.11/otel-0.10.1.11.jar pyroscope-otel.jar

ENV PYROSCOPE_PROFILING_INTERVAL=1ms
ENV PYROSCOPE_PROFILER_LOCK=10ms
ENV PYROSCOPE_PROFILER_ALLOC=512k
ENV PYROSCOPE_UPLOAD_INTERVAL=15s
ENV OTEL_JAVAAGENT_EXTENSIONS=./pyroscope-otel.jar
ENV OTEL_PYROSCOPE_ADD_PROFILE_URL=false
ENV OTEL_PYROSCOPE_ADD_PROFILE_BASELINE_URL=false
ENV OTEL_PYROSCOPE_START_PROFILING=true

EXPOSE 8080

CMD ["java", "-javaagent:/app/opentelemetry-java-instrumentation.jar", "-jar", "app.jar", "-javaagent:pyroscope.jar" ]
