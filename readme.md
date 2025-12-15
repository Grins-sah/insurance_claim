# Insurance Claim Automation Pipeline

Backend service for automating health and vehicle insurance claim processing. This system leverages RAG (Retrieval-Augmented Generation) for policy document analysis and Computer Vision for vehicle damage assessment.

## Core Features

### 1. Health Insurance Claim Validation
- **RAG Pipeline**: Ingests policy documents (PDF/Text), chunks data, and stores vector embeddings in Pinecone.
- **Anomaly Detection**: Uses `Qwen/Qwen2.5-72B-Instruct` (via Hugging Face) to cross-reference claim details against policy documents.
- **Scoring System**: Generates a validity score (0-100) and detailed analysis report for claims officers.

### 2. Vehicle Insurance Analysis
- **Object Detection**: YOLOv8 integration for detecting vehicles in claim images.
- **Damage/Orientation Analysis**: Custom TensorFlow Lite model for identifying vehicle parts and orientation.
- **RC Parsing**: OCR extraction for Registration Certificates using Tesseract.

## Tech Stack

- **Framework**: FastAPI
- **Vector DB**: Pinecone (Serverless)
- **Database**: MongoDB
- **LLM Inference**: Hugging Face Inference API
- **Embeddings**: `mixedbread-ai/mxbai-embed-large-v1` via SentenceTransformers
- **Vision**: Ultralytics YOLO, TensorFlow Lite, OpenCV
- **Package Manager**: uv

## Setup & Installation

### Prerequisites
- Python 3.12+
- Tesseract OCR installed and in PATH
- MongoDB instance
- Pinecone API Key
- Hugging Face API Token

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insurance_claim_project
   ```

2. **Install dependencies using uv**
   ```bash
   uv sync
   ```
   *Alternatively, using pip:*
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```ini
   MONGO_URL=mongodb://localhost:27017/insurance
   PINECONE_API_KEY=your_pinecone_key
   HF_API_TOKEN=your_huggingface_token
   # OPENAI_API_KEY=... (Optional, if switching back to OpenAI)
   ```

## API Reference

### Health Insurance

#### 1. Process Policy Document (RAG)
Triggers the ingestion pipeline: extracts text from PDF, chunks it, and uploads vectors to Pinecone.

- **Endpoint**: `POST /rag/process/{object_id}`
- **Path Param**: `object_id` (MongoDB ObjectId of the uploaded document)

#### 2. Validate Claim
Analyzes a claim query against specific policy documents.

- **Endpoint**: `POST /health/validate_claim`
- **Body**:
  ```json
  {
    "object_ids": ["6578f...", "6579a..."],
    "query": "Claim for knee surgery under policy 12345. Bill amount $5000."
  }
  ```
- **Response**:
  ```json
  {
    "analysis": "Claim Status: VALID\nApproval Score: 85\n..."
  }
  ```

### Vehicle Insurance

#### 1. Detect Vehicle
- **Endpoint**: `GET /vehicle/detect_vehicle`
- **Returns**: Count and bounding boxes of vehicles in the sample image.

#### 2. Orientation Analysis
- **Endpoint**: `GET /vehicle/orientation_detection`
- **Returns**: Classification of vehicle angle/side using TFLite model.

## Project Structure

```
.
├── app/
│   ├── database.py           # MongoDB connection
│   ├── main.py              # Application entry point
│   ├── routes/              # API Route definitions
│   │   ├── health_routes.py
│   │   ├── vehicle_routes.py
│   │   └── rag_routes.py
│   └── services/            # Business logic
│       ├── health_service.py # LLM & Pinecone logic
│       ├── RAG_init.py       # Document processing & Embedding
│       ├── hf_query.py       # Hugging Face API wrapper
│       ├── model_analyzer.py # TFLite inference
│       └── rc_detector.py    # OCR logic
├── weights/                 # ML Model weights
├── notebooks/               # Prototyping notebooks
└── pyproject.toml           # Dependency configuration
```

## Development Notes

- **PDF Handling**: The system automatically detects PDF binary data in MongoDB `data` fields and uses `pypdf` to extract text before embedding.
- **Model Weights**: Ensure `yolov5su.pt` and `best-fp16.tflite` are present in the `weights/` directory for vehicle analysis features to work.
