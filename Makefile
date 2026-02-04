.PHONY: all build build-backend build-frontend k8s-deploy clean restart-backend

# 1. 환경 변수 파일 체크 (.env 하나만 있으면 됨)
check-env:
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found!"; \
		exit 1; \
	fi

# 2. 백엔드 빌드 (이미지 이름을 backend:latest로 통일)
build-backend:
	@echo "🚢 Building Backend Image..."
	docker build -t backend:latest -f ./app/backend/Dockerfile .

build-frontend:
	@echo "🚢 Building Frontend Image..."
	docker build --network=host -t frontend:latest -f ./app/frontend/Dockerfile .

build: build-backend build-frontend

k8s-deploy: check-env
	@echo "🚀 Applying Kubernetes Manifests..."
	@# 1) ConfigMap/Secret 먼저 적용 (순서 중요)
	kubectl apply -f ./k8s/secret.yaml || echo "⚠️ secret.yaml이 없다면 .env 기반 생성 로직 필요"
	kubectl apply -f ./k8s/postgres-pvc.yaml
	@# 2) 나머지 배포
	kubectl apply -f ./k8s/

all: build k8s-deploy
	@echo "✅ All processes finished successfully."

clean:
	@echo "🔥 Cleaning up Kubernetes resources..."
	kubectl delete -f ./k8s/

restart-backend: build-backend
	@echo "🔄 Restarting Backend Pod..."
	kubectl delete pod -l app=backend