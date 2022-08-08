"""Routes File"""
from app import app
from flask import jsonify, request, send_from_directory, send_file, abort, render_template
from .holo_api import reconstruct
from .utils import get_holo_ref_paths
import os

def allowed_image(filename):

    # We only want files with a . in the filename
    if not "." in filename:
        return False

    # Split the extension from the filename
    ext = filename.rsplit(".", 1)[1]

    # Check if the extension is in ALLOWED_IMAGE_EXTENSIONS
    return ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]


def allowed_image_filesize(filesize):
    return filesize is None or int(filesize) <= app.config["MAX_IMAGE_FILESIZE"]


@app.route('/')
def hello_world():
    """The index page. Shows that the Flask server is running."""
    return render_template("public/index.html")


@app.route('/about')
def about():
    """The About page. Shows info about the server."""
    return "DHLM-App Hologram Reconstruction Server"

@app.route('/ping')
def ping_dlhm():
    """The ping page."""
    return jsonify("Who likes DHLM-App? :D")


@app.route("/dlhm/upload", methods=["POST"])
def upload_dlhm():
    def save_img(img_name, path):
            image = request.files[img_name]
            filesize = image.headers["Content-Length"]


            if not allowed_image_filesize(filesize):
                return (False, "Filesize exceeded maximum limit")
                
            
            if image.filename == "":
                return (False, "No filename")
                
            if allowed_image(image.filename):
                image.save(path)
                return (True,)
            else:
                return (False, "File extension is not allowed")
    
    if request.files:
        res = {}
        res["holo"] = save_img("holo", app.config["HOLO_FILEPATH"])

        if "ref" in request.files:
            res["ref"] = save_img("ref", app.config["REF_FILEPATH"])
        elif os.path.exists(app.config["REF_FILEPATH"]):
            os.remove(app.config["REF_FILEPATH"])
        
        return res 


@app.route("/dlhm/create-reconstruction", methods=["POST"])
def create_reconstruction():
    res = reconstruct(*get_holo_ref_paths(), options=request.json, outpath=app.config["REC_FILEPATH"])
    return jsonify(res)


@app.route("/dlhm/get-reconstruction", methods=["GET"])
def get_reconstruction():
    print(f"{app.config['REC_PATH']}/{app.config['REC_FILENAME']}")
    try:
        return send_from_directory(app.config["REC_PATH"], app.config["REC_FILENAME"], as_attachment=False)
    except FileNotFoundError:
        return abort(404) #"An error ocurred during the reconstruction."


@app.route("/get-image/<image_name>", methods = ["GET"])
def get_image(image_name):
    try:
        return send_from_directory(app.config["CLIENT_IMAGES"], image_name, as_attachment=False)
    except FileNotFoundError:
        abort(404)