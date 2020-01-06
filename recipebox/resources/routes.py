from recipebox.resources.recipe import RecipesApi, RecipeApi
from recipebox.resources.auth import SignupApi, LoginApi

def initialize_routes(api):
    api.add_resource(RecipesApi, '/api/recipes')
    api.add_resource(RecipeApi, '/api/recipes/<id>')
    api.add_resource(SignupApi, '/api/auth/signup')
    api.add_resource(LoginApi, '/api/auth/login')
