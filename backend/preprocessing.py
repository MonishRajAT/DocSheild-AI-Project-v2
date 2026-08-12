"""
Data loading and preprocessing utilities for ForgeryVision AI.

This module is responsible for:
1. Loading image datasets from directory
2. Applying TensorFlow preprocessing
3. Applying data augmentation
4. Optimizing the tf.data pipeline
5. Providing visualization utilities
"""

from pathlib import Path
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Configuration

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42

TRAIN_DIR = Path("dataset/train")
VALIDATION_DIR = Path("dataset/validation")

AUTOTUNE = tf.data.AUTOTUNE

# Data Augmentation

data_augmentation = tf.keras.Sequential(
    [
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.10),
        layers.RandomZoom(0.10),
        layers.RandomContrast(0.10),
    ],
    name="data_augmentation",
)

# Dataset Loader

def load_datasets():
    """
    Loads training and validation datasets.

    Returns
    -------
    train_ds : tf.data.Dataset
    validation_ds : tf.data.Dataset
    class_names : list[str]
    """

    train_ds = tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=SEED,
    )

    validation_ds = tf.keras.utils.image_dataset_from_directory(
        VALIDATION_DIR,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False,
    )

    class_names = train_ds.class_names

    train_ds = train_ds.map(
        lambda x, y: (preprocess_input(tf.cast(x, tf.float32)), y),
        num_parallel_calls=AUTOTUNE,
    )

    validation_ds = validation_ds.map(
        lambda x, y: (preprocess_input(tf.cast(x, tf.float32)), y),
        num_parallel_calls=AUTOTUNE,
    )

    train_ds = train_ds.prefetch(AUTOTUNE)
    validation_ds = validation_ds.prefetch(AUTOTUNE)

    train_ds = train_ds.take(500)
    validation_ds = validation_ds.take(100)

    return train_ds, validation_ds, class_names

# Dataset Information

def dataset_info(train_ds, validation_ds, class_names):
    """
    Prints useful dataset information.
    """

    print("=" * 50)
    print("DATASET INFORMATION")
    print("=" * 50)

    print(f"Classes            : {class_names}")
    print(f"Training Batches   : {tf.data.experimental.cardinality(train_ds).numpy()}")
    print(f"Validation Batches : {tf.data.experimental.cardinality(validation_ds).numpy()}")

    print("=" * 50)

# Visualization

def visualize_samples(dataset, class_names):
    """
    Displays a batch of images.

    Parameters
    ----------
    dataset : tf.data.Dataset
    class_names : list
    """

    plt.figure(figsize=(10, 10))

    for images, labels in dataset.take(1):

        # Convert back to displayable range
        images = (images + 1.0) / 2.0

        for i in range(min(9, len(images))):
            ax = plt.subplot(3, 3, i + 1)
            plt.imshow(images[i].numpy())
            plt.title(class_names[int(labels[i])])
            plt.axis("off")

    plt.tight_layout()
    plt.show()

# Main

if __name__ == "__main__":
    train_ds, validation_ds, class_names = load_datasets()
    dataset_info(train_ds, validation_ds, class_names)

    SHOW_SAMPLES = False

    if SHOW_SAMPLES:
        visualize_samples(train_ds, class_names)