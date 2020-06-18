import json

from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from recipebox.database.models import User, Recipe, ScrapingManifest, ShoppingList
from recipebox.resources.errors import InternalServerError


class UserApiOverview(Resource):
    @jwt_required
    def get(self):
        try:
            user_id = get_jwt_identity()
            user = User.objects(id=user_id)
            aggregate = {}
            aggregate['id'] = str(user.first().id)
            aggregate['starred_recipes'] = [str(val.id) for val in user.first().starred_recipes]
            aggregate['authored_recipes'] = [str(val.id) for val in user.first().authored_recipes]
            aggregate['authored_scraping_manifests'] = [str(val.id) for val in user.first().authored_scraping_manifests]
            return jsonify(aggregate)
        except Exception as e:
            print(e)
            raise InternalServerError


class UserApiCreatedRecipes(Resource):
    @jwt_required
    def get(self):
        page = request.args.get('page')
        user_id = get_jwt_identity()
        recipes = Recipe.objects(created_by=user_id).order_by('-created').paginate(page=int(page), per_page=25)
        recipes_result = [json.loads(item.to_json()) for item in recipes.items]
        return jsonify(recipes_result)


class UserApiCreatedScrapingManifests(Resource):
    @jwt_required
    def get(self):
        page = request.args.get('page')
        user_id = get_jwt_identity()
        s_manifest = ScrapingManifest.objects(created_by=user_id).order_by('-created').paginate(page=int(page), per_page=25)
        s_manifest_result = [json.loads(item.to_json()) for item in s_manifest.items]
        return jsonify(s_manifest_result)


class UserApiShoppingList(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        shopping_list = ShoppingList.objects(owner=user_id)
        return Response(shopping_list.to_json(), mimetype="application/json", status=200)


class UserApiStarredRecipes(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        user = User.objects(id=user_id)
        starred_recipes = [val for val in user.first().starred_recipes[::-1]]
        return jsonify(starred_recipes)
