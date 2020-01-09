from flask import Blueprint, Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist,\
ValidationError, InvalidQueryError

from recipebox.database.models import Recipe, User
from recipebox.resources.errors import SchemaValidationError, RecipeAlreadyExistsError,\
InternalServerError, UpdatingRecipeError, DeletingRecipeError, RecipeDoesNotExistError   

class RecipesApi(Resource):

    @jwt_required
    def get(self):
        recipes = Recipe.objects().to_json()
        return Response(recipes, mimetype="application/json", status=200)

    @jwt_required
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)
            recipe =  Recipe(**body, created_by=user).save()
            user.update(push__recipes=recipe)
            user.save()
            id = recipe.id
            return {'id': str(id)}, 201
        except (FieldDoesNotExist, ValidationError):
            raise SchemaValidationError
        except NotUniqueError:
            raise RecipeAlreadyExistsError
        except Exception as e:
            print(e)
            raise InternalServerError
        
class RecipeApi(Resource):
    @jwt_required
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            recipe = Recipe.objects.get(id=id, created_by=user_id)
            body = request.get_json()
            Recipe.objects.get(id=id).update(**body)
            return '', 200
        except InvalidQueryError:
            raise SchemaValidationError
        except DoesNotExist:
            raise UpdatingRecipeError
        except Exception as e:
            print(e)
            raise InternalServerError
    
    @jwt_required
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            recipe = Recipe.objects.get(id=id, created_by=user_id)
            recipe.delete()
            return '', 204
        except DoesNotExist:
            raise DeletingRecipeError
        except Exception as e:
            print(e)
            raise InternalServerError

    def get(self, id):
        try:
            recipes = Recipe.objects.get(id=id).to_json()
            return Response(recipes, mimetype="application/json", status=200)
        except DoesNotExist:
            raise RecipeDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError
