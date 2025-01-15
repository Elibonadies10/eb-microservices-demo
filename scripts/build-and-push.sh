#!/bin/bash

# Exit on any error
set -e

# Get Docker Hub username
if [ -z "$1" ]; then
    echo "Please provide your Docker Hub username as the first argument"
    exit 1
fi

DOCKER_HUB_USERNAME=$1
VERSION=${2:-latest}  # Use 'latest' if no version provided

# Array of services
SERVICES=("frontend" "python-service" "java-service" "load-testing")

echo "Building and pushing images for version: $VERSION"
echo "Using Docker Hub username: $DOCKER_HUB_USERNAME"

# Build all images first
echo "Building all images..."
docker-compose build

# Tag and push each service
for SERVICE in "${SERVICES[@]}"; do
    echo "Processing $SERVICE..."
    
    # Tag the image
    docker tag "microservices-demo-$SERVICE:latest" "$DOCKER_HUB_USERNAME/microservices-demo-$SERVICE:$VERSION"
    
    # Push the image
    echo "Pushing $SERVICE to Docker Hub..."
    docker push "$DOCKER_HUB_USERNAME/microservices-demo-$SERVICE:$VERSION"
done

echo "All images have been built and pushed successfully!"
