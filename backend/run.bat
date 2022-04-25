@echo off
setx FLASK_APP "run.py"
setx FLASK_ENV "development"
setx FLASK_RUN_HOST "http://192.168.1.1"
setx FLASK_RUN_PORT "5000"

flask run