#!/bin/bash

# Exit on any error
set -e

# Get Docker Hub username and environment
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <docker-hub-username> <environment>"
    echo "Environment can be 'dev' or 'prod'"
    exit 1
fi

DOCKER_HUB_USERNAME=$1
ENVIRONMENT=$2
HELM_RELEASE_NAME="microservices"

# Validate environment
if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo "Environment must be 'dev' or 'prod'"
    exit 1
fi

# Create namespace if it doesn't exist
kubectl create namespace microservices --dry-run=client -o yaml | kubectl apply -f -

# Create Docker Hub secret
kubectl create secret docker-registry regcred \
    --docker-server=https://index.docker.io/v1/ \
    --docker-username="$DOCKER_HUB_USERNAME" \
    --docker-password="$(read -p 'Docker Hub Password: ' pwd && echo $pwd)" \
    --docker-email="$(read -p 'Docker Hub Email: ' email && echo $email)" \
    --namespace=microservices \
    --dry-run=client -o yaml | kubectl apply -f -

# Replace Docker Hub username in values file
VALUES_FILE="helm/microservices-demo/values-${ENVIRONMENT}.yaml"
sed -i '' "s/DOCKER_HUB_USERNAME/$DOCKER_HUB_USERNAME/g" "$VALUES_FILE"

# Install/upgrade Helm chart
echo "Deploying to $ENVIRONMENT environment..."
helm upgrade --install \
    --namespace microservices \
    --values "$VALUES_FILE" \
    "$HELM_RELEASE_NAME" \
    helm/microservices-demo

echo "Deployment complete! Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance="$HELM_RELEASE_NAME" --timeout=300s --namespace microservices

echo "Deployment successful! Here are your pods:"
kubectl get pods -n microservices

echo "To access the application, run:"
echo "kubectl get ingress -n microservices"
