#!/bin/bash
echo "🚀 Creating K8s ConfigMap"
kubectl create configmap backend-config \
  --from-env-file=config.env \
  --dry-run=client -o yaml | kubectl apply -f -

echo "🔒 Creating K8s Secret"
kubectl create secret generic backend-secret \
  --from-env-file=secret.env \
  --dry-run=client -o yaml | kubectl apply -f -

echo "🚢 Creating Backend Deployment"
kubectl apply -f backend-deployment.yml

echo "🌐 Deploying Backend Service"
kubectl apply -f backend-service.yml

echo "✅ All done."