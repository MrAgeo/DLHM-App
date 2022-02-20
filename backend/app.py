import time
from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World from Flask!'


@app.route('/time')
def get_current_time():  # put application's code here
    return {"time": time.time()}


if __name__ == '__main__':
    app.run()
