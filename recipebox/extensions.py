from flask_bcrypt import Bcrypt
from flask_mongoengine import MongoEngine
from flask_mail import Mail


bcrypt = Bcrypt()
db = MongoEngine()
mail = Mail()

