import os

from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_mongoengine import MongoEngine
from flask_cors import CORS

from recipebox.database.db import initialize_db
from recipebox.resources.routes import initialize_routes
from recipebox.resources.errors import errors
from recipebox import celery
from recipebox.utils.celery_util import init_celery

bcrypt = Bcrypt()
jwt = JWTManager()
db = MongoEngine()

def create_app(config_filename=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile(config_filename)
    api = Api(app, errors=errors)
    initialize_routes(api)
    initialize_extensions(app)
    print('App created')
    return app

def initialize_extensions(app):
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)
    init_celery(app, celery)
    CORS(app)
