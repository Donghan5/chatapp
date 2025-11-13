.PHONY: all build build-backend build-frontend k8s-config k8s-deploy clean

check-env:
	@if [ ! -f .env ]; then \
		echo "❌ .env does not exist."; \
		exit 1; \
	fi

build-backend:
	@echo "🚢 Build backend image..."
	docker build -t backend-image:latest -f ./app/backend/Dockerfile .

build-frontend:
	@echo "🚢 Build frontend (Nginx) image..."
	docker build -t frontend-image:latest -f ./app/frontend/Dockerfile .

build: build-backend build-frontend

k8s-config: check-env
	@echo "🚀 Applying K8s ConfigMap"
	kubectl create configmap backend-config --from-env-file=config.env --dry-run=client -o yaml | kubectl apply -f -
	@echo "🔒 Applying K8s Secret"
	kubectl create secret generic backend-secret --from-env-file=secret.env --dry-run=client -o yaml | kubectl apply -f -

k8s-deploy:
	@echo "🌐 Deploying K8s"
	kubectl apply -f ./k8s/


all: build k8s-config k8s-deploy
	@echo "✅ All done."

clean:
	@echo "🔥 K8s cleanup..."
	kubectl delete -f ./k8s/
	kubectl delete configmap backend-config
	kubectl delete secret backend-secret