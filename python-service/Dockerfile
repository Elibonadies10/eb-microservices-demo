FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

ENV FLASK_APP=src/app.py
ENV FLASK_ENV=production
ENV JAVA_SERVICE_URL=http://java-service:8080

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
