FROM python:3.11

WORKDIR /app

# Install build dependencies and curl for healthcheck
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install wheel
RUN pip install --upgrade pip && \
    pip install wheel setuptools

COPY requirements.txt .

# Install dependencies one by one with verbose output
RUN pip install -v flask==3.0.0 && \
    pip install -v requests==2.31.0 && \
    pip install -v python-dotenv==1.0.0 && \
    pip install -v flask-cors==4.0.0 && \
    pip install -v protobuf==3.20.3 && \
    pip install -v opentelemetry-api==1.21.0 && \
    pip install -v opentelemetry-sdk==1.21.0 && \
    pip install -v opentelemetry-instrumentation-flask==0.42b0 && \
    pip install -v opentelemetry-exporter-otlp==1.21.0 && \
    pip install -v pyroscope-io==0.8.11 && \
    pip install -v pyroscope-otel==0.4.0

COPY src/ ./src/

ENV FLASK_APP=src/app.py
ENV FLASK_ENV=production
ENV JAVA_SERVICE_URL=http://java-service:8080

# OpenTelemetry SDK Configuration
ENV OTEL_RESOURCE_ATTRIBUTES=service.name=eb-python-service
ENV OTEL_TRACES_SAMPLER=parentbased_always_on
ENV OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
ENV OTEL_METRICS_EXPORTER=otlp
ENV OTEL_LOGS_EXPORTER=otlp
ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_EXPORTER_OTLP_PROTOCOL=grpc

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
