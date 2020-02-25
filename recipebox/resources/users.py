from flask import Blueprint, Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from recipebox.database.models import User, Recipe, ScrapingManifest, ShoppingList
from recipebox.resources.errors import InternalServerError

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
            result = user.first().starred_recipes
            ids = []
            for recipe in result:
                ids.append(recipe.id)
            result = Recipe.objects(id in ids)
            return Response(result.to_json(), mimetype="application/json", status=200)
        except Exception as e:
            print(e)
            raise InternalServerError
