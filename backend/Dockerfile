# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for FAISS and cryptography
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application
COPY . .

# Expose the API port
EXPOSE 8000

# Start Uvicorn server (binding to 0.0.0.0 is required for Docker)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]