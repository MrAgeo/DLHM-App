"""Main file of the Flask Server."""

import os

from flask import Flask

app = Flask(__name__)

# Config
app.config["IMAGE_UPLOADS"] = f"{os.path.dirname(__file__)}/static/img/uploads"
app.config["CLIENT_IMAGES"] = app.config["IMAGE_UPLOADS"]


app.config["HOLO_UPLOADS"] = f'{app.config["IMAGE_UPLOADS"]}/holo'
app.config["REF_UPLOADS"] = f'{app.config["IMAGE_UPLOADS"]}/ref'
app.config["REC_PATH"] = f'{os.path.dirname(__file__)}/static/img/reconstruction'
app.config["HOLO_FILENAME"] = "holo.jpg"
app.config["REF_FILENAME"] = "ref.jpg"
app.config["REC_FILENAME"] = "rec.png"


app.config["HOLO_FILEPATH"] = f'{app.config["HOLO_UPLOADS"]}/{app.config["HOLO_FILENAME"]}'
app.config["REF_FILEPATH"] = f'{app.config["REF_UPLOADS"]}/{app.config["REF_FILENAME"]}'
app.config["REC_FILEPATH"] = f'{app.config["REC_PATH"]}/{app.config["REC_FILENAME"]}'


app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "GIF"]
app.config['MAX_IMAGE_FILESIZE'] = 10 * 1024 * 1024 # Bytes = 10 MB

from app import views
