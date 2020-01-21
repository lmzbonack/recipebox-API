from flask import Blueprint, Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist,\
ValidationError, InvalidQueryError

from recipebox.database.models import Recipe, User, ShoppingList
from recipebox.resources.errors import SchemaValidationError, ShoppingListAlreadyExistsError,\
InternalServerError, UpdatingShoppingListError, DeletingShoppingListError, ShoppingListDoesNotExistError

class ShoppingListsApi(Resource):
    @jwt_required
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)
            slist = ShoppingList(**body, owner=user).save()
            id = slist.id
            return {'id': str(id)}, 201
        except (FieldDoesNotExist, ValidationError):
            raise SchemaValidationError
        except Exception as e:
            print(e)
            raise InternalServerError

class ShoppingListApi(Resource):
    def get(self, id):
        try:
            slist = ShoppingList.objects.get(id=id).to_json()
            return Response(slist, mimetype="application/json", status=200)
        except DoesNotExist:
            raise ShoppingListDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError

    @jwt_required
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            slist = ShoppingList.objects.get(id=id, owner=user_id)
            body = request.get_json()
            result = ShoppingList.objects.get(id=id).update(**body)
            slist = ShoppingList.objects.get(id=id, owner=user_id).to_json()
            return Response(slist, mimetype="application/json", status=200)
        except InvalidQueryError:
            raise SchemaValidationError
        except DoesNotExist:
            raise UpdatingShoppingListError
        except Exception as e:
            print(e)
            raise InternalServerError

    @jwt_required
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            slist = ShoppingList.objects.get(id=id, owner=user_id)
            slist.delete()
            return '', 204
        except DoesNotExist:
            raise DeletingShoppingListError
        except Exception as e:
            print(e)
            raise InternalServerError

# New pair class with a Post, Put, and Delete Methods to add recipe(s) to Shopping List
# Take in 2 ids to do this.
