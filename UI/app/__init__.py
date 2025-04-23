from flask import Flask
from .routes.catelog import catelog_bp
import os

def create_app():
    app = Flask(__name__, template_folder='views', static_folder='static')

    app.register_blueprint(catelog_bp)

    return app