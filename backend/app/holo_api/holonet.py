from tensorflow import keras
import numpy as np

__all__ = ("load_model", "get_model", "predict")


_model = None


def load_model(path):
    global _model
    _model = keras.models.load_model(path)


def get_model():
    global _model
    if _model is None:
        raise RuntimeError("You must call 'holonet.load_model(path)' before calling 'get_model()'.")
    return _model
    # raise NotImplementedError()


def predict(holo):
    if _model is None:
        raise RuntimeError("You must call 'holonet.load_model(path)' before calling 'predict()'.")
    return _model.predict(holo[np.newaxis])
    # raise NotImplementedError()
