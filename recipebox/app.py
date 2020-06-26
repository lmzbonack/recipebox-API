import os

from dotenv import load_dotenv

from recipebox.factory import create_app

BASEDIR = os.path.join(os.path.dirname(__file__), '..')
ENV_PATH = os.path.join(BASEDIR, 'instance/', '.env')
load_dotenv(dotenv_path=ENV_PATH)

environment = os.environ['FLASK_ENV']

if environment == 'dev':    
    app = create_app('dev.cfg')

if environment == 'test':    
    app = create_app('test.cfg')

if environment == 'prod':    
    app = create_app('prod.cfg')
