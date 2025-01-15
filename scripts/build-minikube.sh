#!/bin/bash

# Exit on any error
set -e

echo "Configuring shell to use Minikube's Docker daemon..."
eval $(minikube -p minikube docker-env)

echo "Building Docker images..."
docker-compose build

echo "Images built successfully in Minikube's Docker daemon!"
echo "You can now deploy the application using ./scripts/deploy-minikube.sh"
