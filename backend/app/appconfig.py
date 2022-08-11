"""App configuration"""

import os

__dirpath = os.path.dirname(os.path.realpath(__file__))

app_config = dict()

app_config["IMAGE_UPLOADS"] = f"{__dirpath}/static/img/uploads"

app_config["CLIENT_IMAGES"] = app_config["IMAGE_UPLOADS"]


app_config["HOLO_UPLOADS"] = f'{app_config["IMAGE_UPLOADS"]}/holo'
app_config["REF_UPLOADS"] = f'{app_config["IMAGE_UPLOADS"]}/ref'
app_config["REC_PATH"] = f'{__dirpath}/static/img/reconstruction'
app_config["HOLO_FILENAME"] = "holo.jpg"
app_config["REF_FILENAME"] = "ref.jpg"
app_config["REC_FILENAME"] = "rec.png"

app_config["HOLO_FILEPATH"] = f'{app_config["HOLO_UPLOADS"]}/{app_config["HOLO_FILENAME"]}'
app_config["REF_FILEPATH"] = f'{app_config["REF_UPLOADS"]}/{app_config["REF_FILENAME"]}'
app_config["REC_FILEPATH"] = f'{app_config["REC_PATH"]}/{app_config["REC_FILENAME"]}'

app_config["NEURALNET_MODELSPATH"] = f"{__dirpath}/neuralnet_models"
app_config["FOCUSNET_PATH"] = f'{app_config["NEURALNET_MODELSPATH"]}/FocusNet'
app_config["HOLONET_PATH"] = f'{app_config["NEURALNET_MODELSPATH"]}/HoloNet'

app_config["FOCUSNET_FILENAME"] = "FocusNet_model.h5"
app_config["FOCUSNET_FILEPATH"] = f'{app_config["FOCUSNET_PATH"]}/{app_config["FOCUSNET_FILENAME"]}'

app_config["HOLONET_FILENAME"] = "HoloNet_model.h5"
app_config["HOLONET_FILEPATH"] = f'{app_config["HOLONET_PATH"]}/{app_config["HOLONET_FILENAME"]}'

app_config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "TIFF", "TIF", "BMP"]
app_config['MAX_IMAGE_FILESIZE'] = 10 * 1024 * 1024  # 10 MB (size in bytes)
