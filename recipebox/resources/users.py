from flask import Blueprint, Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from recipebox.database.models import User
from recipebox.resources.errors import InternalServerError

class UserApi(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            user = User.objects.get(id=user_id)
            print(user.to_json())
            return Response(user.to_json(), mimetype="application/json", status=200)
        except Exception as e:
            print(e)
            raise InternalServerError
