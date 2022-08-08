from tensorflow import keras
from .helpers import Rotate90Randomly, Fourier2D
import numpy as np

__all__ = ("get_model", "predict")

from .. import app

_model = keras.models.load_model(app.config["FOCUSNET_FILEPATH"], custom_objects={'Rotate90Randomly': Rotate90Randomly(), 'Fourier2D': Fourier2D()})


def get_model():
    return _model


def predict(holo):
    return _model.predict(holo[np.newaxis])
