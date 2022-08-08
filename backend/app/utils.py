"""Utility Function Library"""


import os

from app import app


def get_holo_ref_paths():
    """Returns the hologram's path and the reference's path (if any).
    In case there is no file, returns None."""

    holopath = app.config["HOLO_FILEPATH"] \
        if os.path.isfile(app.config["HOLO_FILEPATH"]) else None
    refpath = app.config["REF_FILEPATH"] \
        if os.path.isfile(app.config["REF_FILEPATH"]) else None
    return holopath, refpath

