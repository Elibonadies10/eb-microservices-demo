#!/bin/bash

# Exit on any error
set -e

ENVIRONMENT=${1:-dev}  # Default to dev environment if not specified
HELM_RELEASE_NAME="microservices"

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Validate environment
if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo "Environment must be 'dev' or 'prod'"
    exit 1
fi

# Create namespace if it doesn't exist
kubectl create namespace microservices --dry-run=client -o yaml | kubectl apply -f -

# Set the imagePullPolicy to Never in the values file for local development
VALUES_FILE="$PROJECT_ROOT/helm/microservices-demo/values-${ENVIRONMENT}.yaml"

# Deploy using Helm
echo "Deploying to Minikube using Helm..."
helm upgrade --install $HELM_RELEASE_NAME "$PROJECT_ROOT/helm/microservices-demo" \
    --namespace microservices \
    --values $VALUES_FILE \
    --set global.imagePullPolicy=Never \
    --set global.useLocalImages=true

# Wait for all pods to be ready
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod --all -n microservices --timeout=300s

# Get the Minikube IP and NodePort
MINIKUBE_IP=$(minikube ip)
FRONTEND_PORT=$(kubectl get svc -n microservices microservices-frontend -o jsonpath='{.spec.ports[0].nodePort}')

echo "Application deployed successfully!"
echo "You can access the frontend at: http://$MINIKUBE_IP:$FRONTEND_PORT"
