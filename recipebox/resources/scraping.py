from flask import Blueprint, Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from recipe_scrapers import scrape_me

from recipebox.utils.scrape_recipes import RecipeBoxScraper
from recipebox.resources.errors import InternalServerError

class ScrapingApi(Resource):
    @jwt_required
    def post(self):
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

class RecipeScraperApi(Resource):
    @jwt_required
    def post(self):
        try:
            body = request.get_json()
            scraper = scrape_me(body['url'])
            #split instructions on new line and make it into a list
            list_instr = scraper.instructions().splitlines()
            response = {
                "url": body['url'],
                "name": scraper.title(),
                "author": scraper.author(),
                "ingredients": scraper.ingredients(),
                "instructions": list_instr
            }
            return jsonify(response)
        except Exception as e:
            return e, 500
            raise InternalServerError
