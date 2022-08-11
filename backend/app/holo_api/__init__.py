"""Hologram reconstruction API"""

from tkinter import E
from .functions2 import *
# from PIL import Image
import cv2
import numpy as np
from . import focusnet, holonet

_MICROMETER = 1E-6
_NANOMETER = 1E-9

_DTYPE = "float32"

_MIN_LAMBDA, _MAX_LAMBDA = 400, 699  # nm

# TODO: Handle different shapes of ref & holo
# TODO: Select ROI by maximum peak (peaks?) position
def reconstruct(holo_filepath, ref_filepath=None, options=None, outpath=None):
    options = options or \
              {"method": "AS",
               "out_holo_type": "Intensity",
               "constant": "0",
               "Wavelength": "500",  # nm
               "z": "2000"}  # micrometers

    method = options["method"]
    holo_type = options["out_holo_type"]

    wavelength = float(options["Wavelength"]) * _NANOMETER
    pixel_pitch = float(options["dx"]) * _MICROMETER

    if holo_filepath is None:
        print("ERR: No hologram file specified.")
        return False, "No hologram file specified."

    # holo = np.asarray(Image.open(holo_filepath).convert("L"))
    holo = cv2.imread(holo_filepath, cv2.IMREAD_COLOR).astype(_DTYPE)

    # Select minimum value between height & width
    min_val = min(holo.shape[:2])

    ### Select channel
    # Index of BGR channel (values 400 - 699) -> index 0 - 2
    channel = int(max(min(float(options["Wavelength"]), _MAX_LAMBDA), _MIN_LAMBDA) - _MIN_LAMBDA) // 100

    ## Crop holo & ref
    ref = None
    if ref_filepath is None:
        try:
            ref = np.ones((min_val, min_val), dtype=_DTYPE) * float(options["Constant"])
        except ValueError:
            if options["Constant"] == "mean":
                ref = np.mean(holo[:min_val,:min_val, channel])
            else:
                raise ValueError(f"'{options['Constant']}' is not a valid option.")


    else:
        # ref = np.asarray(Image.open(ref_filepath).convert("L"))
        ref = cv2.imread(ref_filepath, cv2.IMREAD_COLOR).astype(_DTYPE)
        min_val = min(min_val, *ref.shape[:2])
        ref = ref[:min_val,:min_val, channel]
    holo = holo[:min_val,:min_val, channel]


    if method == "AS":
        uz = as_reconstruct(holo, ref, pixel_pitch, wavelength, float(options["z"]) * _MICROMETER)
    elif method == "FB":
        uz = fb_reconstruct2(holo - ref, float(options["z"]) * _MICROMETER, float(options["L"]) * _MICROMETER,
                             pixel_pitch, wavelength)
    elif method == "FNet":
        z = focusnet.predict(holo - ref) * 1E-2
        uz = as_reconstruct(holo, ref, pixel_pitch, wavelength, z)
    elif method == "HNet":
        uz = holonet.predict((holo - ref)/255).reshape((min_val, min_val))
        # uz = as_reconstruct(holo, ref, pixel_pitch, wavelength, z)
    else:
        return False, "Invalid Reconstruction Algorithm!"

    img = None
    if holo_type in ("Intensity", "Amplitude"):
        mag = np.abs(uz)
        mx = mag.max()
        mn = mag.min()
        out = (mag - mn) / (mx - mn)
        out = out.astype(float)
        if holo_type == "Intensity":
            img = out ** 2 * 255  # Image.fromarray(out**2 * 255, mode="L")
        elif holo_type == "Amplitude":
            img = out * 255  # Image.fromarray(out * 255, mode="L")
    else:
        phase = np.angle(uz)
        mx = phase.max()
        mn = phase.min()
        out = (phase - mn) / (mx - mn)
        img = out * 255  # Image.fromarray(out * 255, mode="L")

    try:
        # img.save(outpath)
        cv2.imwrite(outpath, img)
    except Exception as ex:
        print(ex)
        return False, "An error occurred during file saving. See server log."

    return True,
