"""Main file of the Flask Server."""

import time
from flask import Flask, jsonify, request

app = Flask(__name__)

# Items list
_defaultList = [f'Item {x + 1}' for x in range(5)]
items = _defaultList[:]


@app.route('/')
def hello_world():
    """The index page. Shows that the Flask server is running."""
    return 'Hello World from Flask!'


@app.route('/time')
def get_current_time():
    """Return the Flask server's time in seconds since the epoch as a floating point number.
    Note: On most OSs, the epoch is Jan 1, 1970 00:00:00 UTC."""
    return {"time": time.time()}


@app.route('/items', methods=('GET', 'POST'), strict_slashes=False)
def get_items():
    """Returns the item list via HTTP GET or adds an item to the list via HTTP POST, returning the added item."""
    if request.method == 'POST':
        items.append(request.json)
        return jsonify(items[-1])
    return jsonify(items)


@app.route('/item_count', methods=('GET',), strict_slashes=False)
def get_count():
    """Returns the item quantity present in the list."""
    return f"{len(items)} items"


@app.route('/reset', methods=('GET',), strict_slashes=False)
def reset():
    """Resets the item list to its default value and returns the resulting item count of the new list."""
    global items
    items = _defaultList[:]
    return f"{len(items)}"


if __name__ == '__main__':
    app.run()
