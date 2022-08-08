"""Main file of the Flask Server."""

import os
from pathlib import Path

from flask import Flask

__dirpath = os.path.dirname(os.path.realpath(__file__))


def _create_dirs():
    global app
    paths = [app.config["IMAGE_UPLOADS"],
             app.config["HOLO_UPLOADS"],
             app.config["REF_UPLOADS"],
             app.config["REC_PATH"],
             app.config["NEURALNET_MODELSPATH"]]

    for p in paths:
        if not os.path.exists(p):
            Path(p).mkdir(parents=True, exist_ok=True)

    if not os.path.exists(app.config["FOCUSNET_FILEPATH"]):
        if not os.path.exists(app.config["FOCUSNET_PATH"]):
            Path(app.config["FOCUSNET_PATH"]).mkdir(parents=True, exist_ok=True)
        raise FileNotFoundError(f"FocusNet model file not found. Please move '{app.config['FOCUSNET_FILENAME']}'" +
                                f" to '{os.path.realpath(app.config['FOCUSNET_PATH'])}'.")


app = Flask(__name__)

# Config
app.config["IMAGE_UPLOADS"] = f"{__dirpath}/static/img/uploads"
app.config["CLIENT_IMAGES"] = app.config["IMAGE_UPLOADS"]


app.config["HOLO_UPLOADS"] = f'{app.config["IMAGE_UPLOADS"]}/holo'
app.config["REF_UPLOADS"] = f'{app.config["IMAGE_UPLOADS"]}/ref'
app.config["REC_PATH"] = f'{__dirpath}/static/img/reconstruction'
app.config["HOLO_FILENAME"] = "holo.jpg"
app.config["REF_FILENAME"] = "ref.jpg"
app.config["REC_FILENAME"] = "rec.png"


app.config["HOLO_FILEPATH"] = f'{app.config["HOLO_UPLOADS"]}/{app.config["HOLO_FILENAME"]}'
app.config["REF_FILEPATH"] = f'{app.config["REF_UPLOADS"]}/{app.config["REF_FILENAME"]}'
app.config["REC_FILEPATH"] = f'{app.config["REC_PATH"]}/{app.config["REC_FILENAME"]}'

app.config["NEURALNET_MODELSPATH"] = f"{__dirpath}/neuralnet_models"
app.config["FOCUSNET_PATH"] = f'{app.config["NEURALNET_MODELSPATH"]}/FocusNet'

app.config["FOCUSNET_FILENAME"] = f"FocusNet_model.h5"
app.config["FOCUSNET_FILEPATH"] = f'{app.config["FOCUSNET_PATH"]}/{app.config["FOCUSNET_FILENAME"]}'

app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "GIF"]
app.config['MAX_IMAGE_FILESIZE'] = 10 * 1024 * 1024  # Bytes = 10 MB

_create_dirs()

from app import views
