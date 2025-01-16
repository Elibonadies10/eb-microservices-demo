from flask import Flask, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/api/load-test/start', methods=['POST'])
def start_load_test():
    try:
        # Start locust in the background
        cmd = [
            "locust",
            "-f", "locustfile.py",
            "--headless",
            "--users", os.getenv("LOAD_TEST_USERS", "50"),
            "--spawn-rate", os.getenv("LOAD_TEST_SPAWN_RATE", "5"),
            "--run-time", f"{os.getenv('LOAD_TEST_DURATION', '300')}s",
            "--host", "http://eb-frontend"
        ]
        
        subprocess.Popen(cmd)
        return jsonify({"message": "Load test started successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8089)
