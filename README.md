# Microservices Demo

This project demonstrates a simple microservices architecture with:
- Python service (Flask)
- Java service (Spring Boot)
- React frontend

## Setup and Running

### Using Docker Compose (Recommended)
The easiest way to run all services is using Docker Compose:

```bash
docker compose up
```

This will start all services:
- Frontend: http://localhost:3000
- Python Service: http://localhost:5000
- Java Service: http://localhost:8080

### Manual Setup (Alternative)

#### Python Service
```bash
cd python-service
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python src/app.py
```

#### Java Service
```bash
cd java-service
./mvnw spring-boot:run  # On Windows: mvnw.cmd spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Python Service
- GET /api/python/hello - Returns a greeting message
- GET /api/python/call-java - Calls the Java service

### Java Service
- GET /api/java/hello - Returns a greeting message
- GET /api/java/call-python - Calls the Python service

## Architecture
The services can communicate with each other, and the frontend can call both services directly. Each service runs on its own port and can be scaled independently.
