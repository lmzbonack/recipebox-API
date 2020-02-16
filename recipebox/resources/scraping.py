from flask import Blueprint, Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

from recipebox.utils.scrape_recipes import RecipeBoxScraper

class ScrapingApi(Resource):
    @jwt_required
    def get(self):
        RBS = RecipeBoxScraper()
        try:
            body = request.get_json()
            result = RBS.scrape_everything(body['url'])
            # Check if result is what we are expecting to see JSON
            if result[0] == '{':
                return Response(result, mimetype="application/json", status=200)
            else:
                return result, 400
        except Exception as e:
            return e, 500
            raise InternalServerError

            