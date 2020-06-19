import datetime
import os

from dotenv import load_dotenv

# load dotenv in the base root
BASEDIR = os.path.join(os.path.dirname(__file__), '..')
ENV_PATH = os.path.join(BASEDIR, 'instance/', '.env')
load_dotenv(dotenv_path=ENV_PATH)

SECRET_KEY = os.getenv('SECRET_KEY')

FLASK_ENV = 'dev'

DEBUG = True
PROPAGATE_EXCEPTIONS = True

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# Hosted Mongo Solution
# MONGODB_SETTINGS = {
#     'db': 'recipebox',
#     'host': 'mongodb+srv://admin:{}@cluster0-sgkwp.mongodb.net/test?retryWrites=true&w=majority'
#     .format(os.environ['MONGO_PASSWORD'])
# }

# Local Mongo DB
MONGODB_SETTINGS = {
    'db': 'recipebox',
    'host': f"mongodb://{os.environ['MONGODB_USERNAME']}:{os.environ['MONGODB_PASSWORD']}@{os.environ['MONGODB_HOSTNAME']}:27017/{os.environ['MONGODB_DATABASE']}"
}

print(MONGODB_SETTINGS)

BCRYPT_LOG_ROUNDS = 15
FLASK_APP = 'recipebox.app'
