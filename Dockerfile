# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for opencv and tesseract
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definitions first to leverage Docker cache
COPY pyproject.toml .
COPY readme.md .

# Create a dummy app structure to allow installing dependencies
# This prevents re-downloading dependencies when only code changes
RUN mkdir app && touch app/__init__.py && \
    pip install --no-cache-dir . && \
    rm -rf app

# Copy project files
COPY app/ ./app/
COPY main.py .
COPY weights/ ./weights/

# Re-install the package to include the actual code
RUN pip install --no-cache-dir .
RUN pip install uvicorn

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
