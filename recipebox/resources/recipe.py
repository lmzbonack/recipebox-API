import json

from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, \
ValidationError, InvalidQueryError

from recipebox.database.models import Recipe, User
from recipebox.resources.errors import SchemaValidationError, RecipeAlreadyExistsError, \
InternalServerError, UpdatingRecipeError, DeletingRecipeError, RecipeDoesNotExistError   


class RecipesApi(Resource):
    @jwt_required
    def get(self):
        # Intelligently check request to see if they are requesting a page that
        # exists if they are not send back an error message that makes sense
        page = request.args.get('page')
        recipes = Recipe.objects.order_by('-created').paginate(page=int(page), per_page=25)
        recipes_result = [json.loads(item.to_json()) for item in recipes.items]
        return jsonify(recipes_result)

    @jwt_required
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)
            recipe = Recipe(**body, created_by=user).save()
            user.update(push__authored_recipes=recipe)
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
    def get(self, id):
        try:
            recipe = Recipe.objects.get(id=id).to_json()
            return Response(recipe, mimetype="application/json", status=200)
        except DoesNotExist:
            raise RecipeDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError

    @jwt_required
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            recipe = Recipe.objects.get(id=id, created_by=user_id)
            body = request.get_json()
            Recipe.objects.get(id=id).update(**body)
            recipe = Recipe.objects.get(id=id, created_by=user_id).to_json()
            return Response(recipe, mimetype="application/json", status=200)
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


class StarApi(Resource):
    @jwt_required
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            user = User.objects.get(id=user_id)
            recipe = Recipe.objects.get(id=id)
            if recipe not in user.starred_recipes:
                user.update(push__starred_recipes=recipe)
                return '', 200
            else:
                return 'Recipe is already starred for this user', 400
        except DoesNotExist:
            raise RecipeDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError

    @jwt_required
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            user = User.objects.get(id=user_id)
            recipe = Recipe.objects.get(id=id)
            if recipe in user.starred_recipes:
                user.update(pull__starred_recipes=recipe)
                return '', 200
            else:
                return 'Recipe is not currently starred for this user', 400
        except DoesNotExist:
            raise RecipeDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError
