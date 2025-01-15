# Microservices Demo

This project demonstrates a simple microservices architecture with:
- Python service (Flask)
- Java service (Spring Boot)
- React frontend

## Setup and Running

### Python Service
```bash
cd python-service
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python src/app.py
```
The Python service will run on http://localhost:5000

### Java Service
```bash
cd java-service
./mvnw spring-boot:run  # On Windows: mvnw.cmd spring-boot:run
```
The Java service will run on http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

## API Endpoints

### Python Service
- GET /api/python/hello - Returns a greeting message
- GET /api/python/call-java - Calls the Java service

### Java Service
- GET /api/java/hello - Returns a greeting message
- GET /api/java/call-python - Calls the Python service

## Architecture
The services can communicate with each other, and the frontend can call both services directly. Each service runs on its own port and can be scaled independently.
