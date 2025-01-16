FROM python:3.9-slim

WORKDIR /load-testing

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libc-dev \
    make \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY locustfile.py app.py ./

# Environment variables for test configuration
ENV LOAD_TEST_DURATION=300
ENV LOAD_TEST_USERS=50
ENV LOAD_TEST_SPAWN_RATE=5

CMD ["python", "app.py"]
