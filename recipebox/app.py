import os

from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from recipebox.database.db import initialize_db
from recipebox.resources.routes import initialize_routes
from recipebox.resources.errors import errors

app = Flask(__name__)
app.config.from_envvar('ENV_FILE_LOCATION')

api = Api(app, errors=errors)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'recipebox',
    'host': 'mongodb+srv://admin:{}@cluster0-sgkwp.mongodb.net/test?retryWrites=true&w=majority'
    .format(os.environ['MONGO_PASSWORD'])
}

initialize_db(app)
initialize_routes(api)

if __name__ == '__main__':
    app.run()