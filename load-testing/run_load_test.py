import subprocess
import sys
import os

def run_load_test(duration_seconds=300, num_users=50, spawn_rate=5):
    """
    Run a load test with specified parameters
    """
    cmd = [
        "locust",
        "-f", "locustfile.py",
        "--web-host", "0.0.0.0",
        "--web-port", "8089",
        "--host", os.getenv("LOCUST_HOST", "http://eb-frontend"),
        "--users", str(num_users),
        "--spawn-rate", str(spawn_rate),
        "--run-time", f"{duration_seconds}s",
        "--only-summary"     # Only print the final summary
    ]
    
    print(f"Starting Locust web interface on port 8089")
    print(f"Starting load test with {num_users} users, spawn rate of {spawn_rate}/sec for {duration_seconds} seconds")
    
    # Run the load test
    process = subprocess.Popen(cmd)
    process.communicate()
    
    print("Load test completed")
    return process.returncode

if __name__ == "__main__":
    # Get parameters from environment variables or use defaults
    duration = int(os.getenv("LOAD_TEST_DURATION", "300"))  # 5 minutes default
    users = int(os.getenv("LOAD_TEST_USERS", "50"))        # 50 users default
    spawn_rate = int(os.getenv("LOAD_TEST_SPAWN_RATE", "5"))  # 5 users per second default
    
    # Run the test
    sys.exit(run_load_test(duration, users, spawn_rate))
