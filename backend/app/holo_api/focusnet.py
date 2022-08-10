from tensorflow import keras
from .helpers import Rotate90Randomly, Fourier2D
import numpy as np

__all__ = ("get_model", "predict")


_model = None


def load_model(path):
    global _model
    _model = keras.models.load_model(path, custom_objects={'Rotate90Randomly': Rotate90Randomly(), 'Fourier2D': Fourier2D()})


def get_model():
    global _model
    if _model is None:
        raise RuntimeError("You must call 'focusnet.load_model(path)' before calling 'get_model()'.")
    return _model


def predict(holo):
    if _model is None:
        raise RuntimeError("You must call 'focusnet.load_model(path)' before calling 'predict()'.")
    return _model.predict(holo[np.newaxis])
