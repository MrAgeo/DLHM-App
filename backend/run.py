from app import app

# from werkzeug.serving import run_simple


if __name__ == '__main__':
    # from app import views
    app.config["ENV"] = "development"
    app.run()
