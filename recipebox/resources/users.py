from flask import Blueprint, Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from recipebox.database.models import User, Recipe, ScrapingManifest, ShoppingList
from recipebox.resources.errors import InternalServerError


# list_numbers = [1, 2, 3, 4]
# map_iterator = map(lambda x: x * 2, list_numbers)
# print_iterator(map_iterator)
# [f(x) for x in iterable]
class UserApiOverview(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            user = User.objects(id=user_id)
            aggregate = {}
            aggregate['id'] = str(user.first().id)
            aggregate['starred_recipes'] = [ str(val.id) for val in user.first().starred_recipes]
            aggregate['authored_recipes'] = [ str(val.id) for val in user.first().authored_recipes]
            aggregate['authored_scraping_manifests'] = [ str(val.id) for val in user.first().authored_scraping_manifests]
            return jsonify(aggregate)
        except Exception as e:
            print(e)
            raise InternalServerError

class UserApiCreatedRecipes(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            recipes = Recipe.objects(created_by=user_id)
            return Response(recipes.to_json(), mimetype="application/json", status=200)
        except Exception as e:
            print(e)
            raise InternalServerError

class UserApiCreatedScrapingManifests(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            s_manifest = ScrapingManifest.objects(created_by=user_id)
            return Response(s_manifest.to_json(), mimetype="application/json", status=200)
        except Exception as e:
            print(e)
            raise InternalServerError

class UserApiShoppingList(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            shopping_list = ShoppingList.objects(owner=user_id)
            return Response(shopping_list.to_json(), mimetype="application/json", status=200)
        except Exception as e:
            print(e)
            raise InternalServerError

class UserApiStarredRecipes(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            user = User.objects(id=user_id)
            starred_recipes = [ val for val in user.first().starred_recipes ]
            # result = user.first().starred_recipes
            # ids = []
            # for recipe in result:
            #     ids.append(recipe.id)
            # result = Recipe.objects(id__in=ids)
            # return Response(result.to_json(), mimetype="application/json", status=200)
            return jsonify(starred_recipes)
        except Exception as e:
            print(e)
            raise InternalServerError
