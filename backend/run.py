from app import app
from werkzeug.serving import run_simple

app.config["ENV"] = "development"

if __name__ == '__main__':
    app.run()