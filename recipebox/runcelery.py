from recipebox import celery
from recipebox.factory import create_app
from recipebox.utils.celery_util import init_celery

app = create_app('flask.cfg')
init_celery(app, celery)
