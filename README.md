# 🛡️ DocShield AI V2

### AI-Powered Document Authenticity Detection

> **Detect forged documents with deep-learning-powered image classification.**

DocShield AI is an AI-powered document authenticity detection system that analyzes document images and classifies them as **Genuine** or **Forged** using a trained **MobileNetV2** deep-learning model.

**DocShield AI V2** is the second version of the project, evolving from the original Streamlit-based application into a more production-oriented architecture with a dedicated **FastAPI backend** and a modern **HTML, CSS, and JavaScript frontend**.

---

## 🚀 V2 Evolution

The original DocShield AI was developed and deployed using **Streamlit**, providing a fast way to build and validate the AI application.

With V2, the project has been redesigned with a clear separation between the AI backend and user interface.

### V1

```text
Streamlit UI
     ↓
Python Prediction Logic
     ↓
MobileNetV2 Model
```

### V2

```text
HTML + CSS + JavaScript
          ↓
       FastAPI
          ↓
 Prediction Service
          ↓
      MobileNetV2
          ↓
 Genuine / Forged
```

This architecture makes the system easier to maintain, integrate, extend, and deploy as a dedicated AI application.

---

# ✨ Features

* 🤖 **AI-Powered Document Verification**
* 🧠 **MobileNetV2 Deep Learning Model**
* 📄 **Document Image Upload**
* 🔍 **Genuine / Forged Classification**
* 📊 **Prediction Confidence Score**
* ⚡ **FastAPI REST API**
* 🎨 **Modern Premium Web Interface**
* 🖱️ **Drag-and-Drop Upload**
* 📱 **Responsive Frontend**
* 🔐 **Backend File-Type Validation**
* ⚠️ **User-Friendly Error Handling**
* 📖 **Automatic FastAPI API Documentation**

---

# 🧠 How It Works

DocShield AI follows a simple AI inference pipeline:

```text
                 DOCUMENT IMAGE
                       │
                       ▼
              ┌─────────────────┐
              │   File Upload   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     FastAPI     │
              │    REST API     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Image Processing│
              │   224 × 224     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   MobileNetV2   │
              │  Deep Learning  │
              │      Model      │
              └────────┬────────┘
                       │
                       ▼
             ┌───────────────────┐
             │ Genuine / Forged  │
             │    + Confidence   │
             └───────────────────┘
```

---

# 🧪 Model & Prediction

The system uses a trained **MobileNetV2** model for document image classification.

### Input

Document image:

* JPG
* JPEG
* PNG
* WEBP

### Image Processing

Images are:

1. Converted to RGB
2. Resized to `224 × 224`
3. Converted into a numerical array
4. Processed using MobileNetV2 preprocessing

### Output

The API returns:

```json
{
  "prediction": "Genuine",
  "confidence": 97.42,
  "probability": 0.9742
}
```

Where:

* `prediction` → Genuine or Forged
* `confidence` → Prediction confidence percentage
* `probability` → Raw probability for the Genuine class

---

# 🏗️ Project Architecture

```text
DocShield-AI/
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── predict.py
│   ├── preprocessing.py
│   ├── schemas.py
│   │
│   └── services/
│       ├── __init__.py
│       └── prediction_service.py
│
├── models/
│   └── docshield_model.keras
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
│
├── .gitignore
├── .python-version
├── requirements.txt
└── README.md
```

---

# ⚙️ Technology Stack

### Backend

* **Python**
* **FastAPI**
* **Uvicorn**
* **Pydantic**

### Artificial Intelligence

* **TensorFlow**
* **Keras**
* **MobileNetV2**
* **NumPy**
* **Pillow**
* **OpenCV**
* **Scikit-learn**

### Frontend

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**

### API

* REST API
* JSON responses
* Multipart file upload
* FastAPI Swagger documentation

---

# 🔌 API Endpoints

## Root

```http
GET /
```

Returns the API status.

---

## Health Check

```http
GET /health
```

Used to verify that the backend is running correctly.

---

## Document Prediction

```http
POST /api/predict
```

### Request

Multipart form-data:

```text
file = document image
```

### Response

```json
{
  "prediction": "Genuine",
  "confidence": 97.42,
  "probability": 0.9742
}
```

---

# 🖥️ Running Locally

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd DocShield-AI
```

## 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 4. Start the FastAPI backend

Run from the project root:

```bash
uvicorn backend.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

---

# 📖 API Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### OpenAPI Schema

```text
http://127.0.0.1:8000/openapi.json
```

---

# 🎯 V1 → V2

DocShield AI V2 represents an architectural evolution rather than a complete replacement of the original AI system.

### DocShield AI V1

* Streamlit-based application
* Integrated UI and Python inference
* Rapid AI prototype
* Deployed Streamlit application

### DocShield AI V2

* Dedicated FastAPI backend
* REST API architecture
* Separate frontend
* HTML/CSS/JavaScript UI
* Reusable prediction service
* Structured API schemas
* Better separation of concerns
* Production-oriented project structure

The trained model and core prediction concept remain central to both versions.

---

# 🔮 Future Improvements

Potential future improvements include:

* User authentication
* Document verification history
* Database integration
* Batch document analysis
* Advanced document manipulation detection
* Explainable AI insights
* Model performance monitoring
* Cloud deployment
* API authentication and rate limiting
* Automated model retraining pipeline

---

# ⚠️ Disclaimer

DocShield AI is an AI-based document classification system intended for research, experimentation, and educational purposes.

AI predictions should not be treated as definitive proof of document authenticity in high-stakes or legal situations.

---

# 👨‍💻 Author

**Monish Raj A T**

B.Tech — Artificial Intelligence & Machine Learning

---

## ⭐ Project

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
