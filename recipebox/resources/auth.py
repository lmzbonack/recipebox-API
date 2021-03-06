import datetime

from flask import Response, request
from flask_jwt_extended import create_access_token
from flask_restful import Resource
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist

from recipebox.database.models import User
from recipebox.resources.errors import SchemaValidationError, EmailAlreadyExistsError, UnauthorizedError, \
InternalServerError

class SignupApi(Resource):
    def post(self):
        try:
            body = request.get_json()
            user = User(**body)
            user.hash_password()
            user.save()
            id = user.id
            return {'id': str(id)}, 201
        except NotUniqueError:
            raise EmailAlreadyExistsError
        except FieldDoesNotExist:
            raise SchemaValidationError
        except Exception as e:
            print(e)
            raise InternalServerError
        

class LoginApi(Resource):
    def post(self):
        print('login called', flush=True)
        try:
            body = request.get_json()
            user = User.objects.get(email=body.get('email'))
            authorized = user.check_password(body.get('password'))
        
            if not authorized:
                raise UnauthorizedError

            expires = datetime.timedelta(days=1)
            access_token = create_access_token(identity = str(user.id), expires_delta = expires)
            return {'token': access_token}, 201
        except (UnauthorizedError, DoesNotExist):
            raise UnauthorizedError
        except Exception as e:
            print(e)
            raise InternalServerError
