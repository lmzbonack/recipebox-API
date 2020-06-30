import os

from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_mongoengine import MongoEngine
from flask_cors import CORS

from recipebox.extensions import mail, db, bcrypt

from recipebox.resources.routes import initialize_routes
from recipebox.resources.errors import errors
from recipebox import celery
from recipebox.utils.celery_util import init_celery


jwt = JWTManager()

def create_app(config_filename=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile(config_filename)
    api = Api(app, errors=errors)
    # We need this because we are registering our APIs with blueprints
    app.handle_user_exception = api.handle_error
    initialize_routes(api)
    initialize_extensions(app)
    return app

def initialize_extensions(app):
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)
    mail.init_app(app)
    init_celery(app, celery)
    CORS(app)
