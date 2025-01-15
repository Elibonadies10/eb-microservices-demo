from locust import HttpUser, task, between

class MicroservicesUser(HttpUser):
    # Wait between 1 and 3 seconds between tasks
    wait_time = between(1, 3)
    
    @task(2)
    def test_python_service(self):
        """Test direct Python service endpoint"""
        with self.client.get("/api/python/hello", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status code: {response.status_code}")
    
    @task(2)
    def test_java_service(self):
        """Test direct Java service endpoint"""
        with self.client.get("/api/java/hello", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status code: {response.status_code}")
    
    @task(1)
    def test_python_calling_java(self):
        """Test Python service calling Java service"""
        with self.client.get("/api/python/call-java", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status code: {response.status_code}")
    
    @task(1)
    def test_java_calling_python(self):
        """Test Java service calling Python service"""
        with self.client.get("/api/java/call-python", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status code: {response.status_code}")

    def on_start(self):
        """Called when a User starts running"""
        # You could add setup logic here if needed
        pass
