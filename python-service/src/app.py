from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

JAVA_SERVICE_URL = os.getenv('JAVA_SERVICE_URL', 'http://localhost:8080')

@app.route('/api/python/hello')
def hello():
    return jsonify({"message": "Hello from Python Service!"})

@app.route('/api/python/call-java')
def call_java():
    try:
        response = requests.get(f"{JAVA_SERVICE_URL}/api/java/hello")
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate-error', methods=['GET'])
def generate_error():
    raise Exception("This is a generated error from the Python service!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
