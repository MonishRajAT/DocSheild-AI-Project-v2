from pathlib import Path
from backend.predict import predict

def predict_document(file_path: str):
    """
    Run document authenticity prediction.

    Parameters
    ----------
    file_path : str
        Path to the uploaded document image.

    Returns
    -------
    tuple
        prediction label, confidence percentage, and raw probability.
    """

    _, label, confidence, probability = predict(
        Path(file_path)
    )

    return label, confidence * 100, probability