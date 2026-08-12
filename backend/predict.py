# Single Image Prediction using MobileNetV2

from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# Configuration

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "docshield_model.keras"

IMAGE_SIZE = (224, 224)

CLASS_NAMES = ["Forged", "Genuine"]


# Load Model

print("Loading trained model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.\n")


# Image Preprocessing

def preprocess_image(image_path: str):
    """
    Loads and preprocesses an image for prediction.
    """

    image = Image.open(image_path).convert("RGB")

    image = image.resize(IMAGE_SIZE)

    image_array = np.array(image).astype("float32")

    image_array = preprocess_input(image_array)

    image_array = np.expand_dims(image_array, axis=0)

    return image, image_array


# Prediction

def predict(image_path: str):
    """
    Predict image authenticity.
    """

    original_image, processed_image = preprocess_image(image_path)

    probability = model.predict(
        processed_image,
        verbose=0
    )[0][0]

    if probability >= 0.5:
        label = "Genuine"
        confidence = probability
    else:
        label = "Forged"
        confidence = 1 - probability

    return original_image, label, confidence, probability