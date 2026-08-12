# 🛡️ DocShield AI V2

### AI-Powered Document Authenticity Detection

> **Detect forged documents using a fine-tuned MobileNetV2 deep-learning model with a FastAPI backend and a modern web frontend.**

DocShield AI V2 is the second version of the DocShield AI project, evolving the original Streamlit application into a more structured **FastAPI + HTML/CSS/JavaScript architecture**.

---

## 🔗 Important: Model Training & Dataset

**DocShield AI V2 is an inference-focused application.**

The trained model used by V2 was developed in the original **DocShield AI V1** project using a document-image dataset, TensorFlow data preprocessing, **MobileNetV2 transfer learning**, and fine-tuning.

### 📚 DocShield AI V1 — Training & Dataset

The complete training pipeline, dataset structure, preprocessing code, model-training code, evaluation workflow, and original Streamlit implementation are maintained separately in the V1 repository:

👉 **[DocShield AI V1 — Training & Dataset Repository](https://github.com/MonishRajAT/DocSheild-AI-Project)**

The V1 repository contains the components used to develop the trained model, including:

```text
dataset/
├── train/
└── validation/

train.py
preprocessing.py
predict.py
models/
└── docshield_model.keras
```

The V1 model-development workflow includes:

```text
Dataset
   ↓
Image Preprocessing
   ↓
TensorFlow Data Pipeline
   ↓
MobileNetV2
   ↓
Transfer Learning
   ↓
Fine-Tuning
   ↓
Trained Model
   ↓
DocShield AI V2
```

The original project uses **MobileNetV2 pretrained on ImageNet**, followed by transfer learning and fine-tuning for binary document authenticity classification between **Genuine** and **Forged** documents.

### Why isn't the dataset in V2?

The V2 repository is intentionally focused on **model inference and application delivery**.

The dataset and model-training pipeline are kept in V1 so that:

* V2 remains lightweight and deployment-focused
* Training and inference responsibilities stay separated
* The original dataset and experimentation pipeline remain reproducible
* V2 can focus on serving the already-trained model through an API

**In simple terms:**

> **V1 = Train the AI model**
> **V2 = Serve and use the trained AI model**

---

# 🚀 V1 → V2 Evolution

## DocShield AI V1

The original version was built as an end-to-end deep-learning application using Streamlit.

```text
Dataset
   ↓
Preprocessing
   ↓
MobileNetV2
   ↓
Transfer Learning
   ↓
Fine-Tuning
   ↓
Trained Model
   ↓
Streamlit
   ↓
Prediction
```

V1 focused on:

* Dataset preparation
* Model training
* Transfer learning
* Fine-tuning
* Model evaluation
* Streamlit deployment

## DocShield AI V2

V2 takes the trained model from V1 and focuses on application architecture and inference.

```text
HTML + CSS + JavaScript
          ↓
       FastAPI
          ↓
 Prediction Service
          ↓
   Trained MobileNetV2
          ↓
 Genuine / Forged
```

V2 focuses on:

* REST API architecture
* Dedicated FastAPI backend
* Reusable prediction service
* Structured API schemas
* Modern frontend
* Separation of frontend and backend
* Production-oriented inference workflow

---

# 🧠 Model Lineage

The model used by V2 is **not trained inside the V2 application**.

Its lineage is:

```text
V1 Dataset
    ↓
V1 Preprocessing
    ↓
V1 MobileNetV2 Transfer Learning
    ↓
V1 Fine-Tuning
    ↓
docshield_model.keras
    ↓
V2 FastAPI Inference
    ↓
V2 Web Interface
```

This means the V2 `models/docshield_model.keras` file is the **trained inference artifact produced from the V1 model-development pipeline**.

For anyone interested in reproducing or retraining the model, start with the V1 repository:

👉 **https://github.com/MonishRajAT/DocSheild-AI-Project**

---

# 🏗️ V2 Architecture

```text
                     DOCSHIELD AI V2

                 ┌───────────────────┐
                 │   Web Frontend    │
                 │ HTML / CSS / JS   │
                 └─────────┬─────────┘
                           │
                           │ REST API
                           ▼
                 ┌───────────────────┐
                 │      FastAPI      │
                 │      Backend      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Prediction Service│
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ MobileNetV2 Model │
                 │  docshield_model  │
                 └─────────┬─────────┘
                           │
                           ▼
                    Genuine / Forged
```

---

# 📂 V2 Project Structure

```text
DocShield-AI-V2/
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
│   ├── style.css
│   │── app.js
│   
├── .gitignore
├── .python-version
├── requirements.txt
└── README.md
```

---

# 🔌 API

### `POST /api/predict`

Accepts a document image and returns:

```json
{
  "prediction": "Genuine",
  "confidence": 97.42,
  "probability": 0.9742
}
```

### `GET /health`

Checks whether the backend is running.

### `GET /`

Returns basic API information.

---

# 🧪 Inference Pipeline

```text
Uploaded Document
       ↓
File Validation
       ↓
RGB Conversion
       ↓
Resize → 224 × 224
       ↓
MobileNetV2 Preprocessing
       ↓
Trained Model
       ↓
Prediction Probability
       ↓
Genuine / Forged
       ↓
Confidence Score
       ↓
Frontend Result
```

---

# 🛠️ Technology Stack

### V2 Application

* Python
* FastAPI
* Uvicorn
* TensorFlow
* Keras
* MobileNetV2
* NumPy
* Pillow
* OpenCV
* HTML5
* CSS3
* Vanilla JavaScript

### V1 Model Development

* TensorFlow
* Keras
* MobileNetV2
* TensorFlow Dataset Pipeline
* OpenCV
* Scikit-learn
* Matplotlib
* Streamlit

---

# ▶️ Running V2 Locally

Clone the V2 repository:

```bash
git clone <V2_REPOSITORY_URL>
cd DocShield-AI-V2
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn backend.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔮 Future Improvements

* PDF document support
* OCR integration
* Explainable AI with Grad-CAM
* Batch document processing
* Authentication
* Verification history
* Cloud deployment
* API authentication and rate limiting
* Multi-class document verification
* Model monitoring and retraining pipeline

---

# ⚠️ Disclaimer

DocShield AI is an AI-based document classification system intended for research, experimentation, and educational purposes.

Predictions should not be treated as definitive proof of document authenticity in high-stakes, legal, or financial decisions.

---

# 👨‍💻 Author

**Monish Raj A T**

B.Tech — Artificial Intelligence & Machine Learning
University Visvesvaraya College of Engineering (UVCE)

---

## ⭐ Project

If you find DocShield AI interesting, consider starring the repository.
