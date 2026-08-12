from pydantic import BaseModel, Field

class PredictionResponse(BaseModel):
    prediction: str = Field(
        ...,
        description="Predicted document class: Genuine or Forged"
    )

    confidence: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Prediction confidence percentage"
    )

    probability: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Raw probability of the document being Genuine"
    )