# Kubernetes Manifests

This directory contains all Kubernetes deployment manifests for the Todo Backend application.

## Files

- **configmap.yaml** - Configuration map for non-sensitive configuration
- **deployment.yaml** - Main application deployment with replicas, resources, and probes
- **service.yaml** - Kubernetes service for exposing the application
- **ingress.yaml** - Ingress configuration for external access
- **hpa.yaml** - Horizontal Pod Autoscaler for automatic scaling
- **secret.yaml** - Template for Kubernetes secrets (DO NOT commit actual secrets)

## Deployment

To deploy to Kubernetes:

```bash
# Create namespace
kubectl create namespace todo-backend

# Create secrets (update with actual values)
kubectl create secret generic todo-backend-secrets \
  --from-literal=DATABASE_URL=postgresql://... \
  --from-literal=JWT_SECRET=... \
  --from-literal=UPSTASH_REDIS_URL=... \
  --from-literal=UPSTASH_REDIS_TOKEN=... \
  -n todo-backend

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

## Verification

```bash
# Check pods
kubectl get pods -n todo-backend

# Check services
kubectl get svc -n todo-backend

# Check ingress
kubectl get ingress -n todo-backend

# View logs
kubectl logs -f deployment/todo-backend -n todo-backend
```

## Notes

- All resources are deployed to the `todo-backend` namespace
- The HPA automatically scales between 2-4 replicas based on CPU usage
- Health checks are configured for both liveness and readiness probes
- Resource limits are set to prevent resource exhaustion
