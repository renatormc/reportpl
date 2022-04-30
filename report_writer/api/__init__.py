from .app import app
from . import config

def run_app():
    app.run(host='0.0.0.0', port=5001, debug=config.DEBUG)