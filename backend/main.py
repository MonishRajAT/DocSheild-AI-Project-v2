from pathlib import Path
import shutil
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import PredictionResponse
from backend.services.prediction_service import predict_document


# FastAPI Application

app = FastAPI(
    title="DocShield AI API",
    description="AI-powered document authenticity detection API",
    version="2.0.0",
)

# CORS Configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint

@app.get("/")
def root():
    return {
        "message": "DocShield AI API is running",
        "status": "success",
        "version": "2.0.0",
    }

# Health Check Endpoint
@app.get("/health")
def health_check():
    return {
        "message": "DocShield AI API is healthy",
        "status": "success",
    }

# Document Prediction Endpoint
@app.post(
    "/api/predict",
    response_model=PredictionResponse,
)
async def predict_document_api(
    file: UploadFile = File(...)
):
    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }

    file_extension = Path(file.filename or "").suffix.lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.",
        )

    temporary_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension,
        ) as temp_file:

            temporary_path = Path(temp_file.name)

            shutil.copyfileobj(
                file.file,
                temp_file,
            )

        prediction, confidence, probability = predict_document(
            str(temporary_path)
        )

        return PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            probability=probability,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during prediction: {str(e)}",
        )

    finally:
        if temporary_path and temporary_path.exists():
            temporary_path.unlink(missing_ok=True)

        await file.close()