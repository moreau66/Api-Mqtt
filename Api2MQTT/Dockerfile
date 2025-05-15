# Étape 1 : builder le frontend avec Vite
FROM node:20 AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend ./
RUN npm run build

# Étape 2 : builder le backend avec FastAPI
FROM python:3.11-slim AS backend

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Si le frontend est activé, on copie les fichiers construits
ARG ENABLE_FRONTEND=false
ENV ENABLE_FRONTEND=${ENABLE_FRONTEND}

COPY --from=frontend-builder /app/frontend/dist ./frontend_dist

EXPOSE 8000

CMD ["uvicorn", "api2mqtt.main:app", "--host", "0.0.0.0", "--port", "8000"]
