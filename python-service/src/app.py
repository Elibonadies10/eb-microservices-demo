from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.flask import FlaskInstrumentor

import pyroscope

# Debug print environment variables
print("=====================================")
print("PYROSCOPE CONFIGURATION DEBUG OUTPUT:")
print(f"Server Address: {os.getenv('PYROSCOPE_SERVER_ADDRESS')}")
print(f"Username: {os.getenv('PYROSCOPE_USERNAME')}")
print(f"Password present: {os.getenv('PYROSCOPE_PASSWORD') is not None}")
if os.getenv('PYROSCOPE_PASSWORD') is not None:
    print(f"Password length: {len(os.getenv('PYROSCOPE_PASSWORD'))}")
print("=====================================")

# Only configure if we have the server address
server_address = os.getenv('PYROSCOPE_SERVER_ADDRESS')
if server_address:
    pyroscope.configure(
        application_name="eb-python-service",
        server_address=server_address,
        basic_auth_username=os.getenv('PYROSCOPE_USERNAME'),
        basic_auth_password=os.getenv('PYROSCOPE_PASSWORD'),
    )

# import span processor
from pyroscope.otel import PyroscopeSpanProcessor

# obtain a OpenTelemetry tracer provider
from opentelemetry.sdk.trace import TracerProvider
provider = TracerProvider()

# Configure OTLP exporter
otlp_exporter = OTLPSpanExporter(endpoint=os.getenv('OTEL_EXPORTER_OTLP_ENDPOINT'))
provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

# register the pyroscope span processor for profiling
provider.add_span_processor(PyroscopeSpanProcessor())

# register the tracer provider
trace.set_tracer_provider(provider)

app = Flask(__name__)
CORS(app)

# Initialize Flask instrumentation
FlaskInstrumentor().instrument_app(app)

tracer = trace.get_tracer(__name__)

JAVA_SERVICE_URL = os.getenv('JAVA_SERVICE_URL', 'http://localhost:8080')

@app.route('/api/python/hello')
def hello():
    with tracer.start_as_current_span("hello") as span:
        return jsonify({"message": "Hello from Python!"})

@app.route('/api/python/call-java')
def call_java():
    with tracer.start_as_current_span("call_java") as span:
        response = requests.get(f"{JAVA_SERVICE_URL}/api/java/hello")
        return jsonify({"message": response.json()["message"]})

@app.route('/api/python/generate-error')
def generate_error():
    raise Exception("This is a test error")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
