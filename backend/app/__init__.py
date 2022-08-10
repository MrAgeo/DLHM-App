"""Main file of the Flask Server."""

import os
from pathlib import Path
from flask import Flask
from .appconfig import app_config


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

    if not os.path.exists(app.config["HOLONET_FILEPATH"]):
        if not os.path.exists(app.config["HOLONET_PATH"]):
            Path(app.config["HOLONET_PATH"]).mkdir(parents=True, exist_ok=True)
        raise FileNotFoundError(f"HoloNet model file not found. Please move '{app.config['HOLONET_FILENAME']}'" +
                                f" to '{os.path.realpath(app.config['HOLONET_PATH'])}'.")


app = Flask(__name__)

# Apply custom configuration
app.config.update(app_config)

# Check if paths exist. If not, create them.
_create_dirs()

from .holo_api import focusnet

focusnet.load_model(app.config["FOCUSNET_FILEPATH"])
from app import views
