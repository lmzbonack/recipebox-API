from recipebox.resources.recipe import RecipesApi, RecipeApi, StarApi
from recipebox.resources.scraping import ScrapingApi
from recipebox.resources.shopping_list import ShoppingListApi, ShoppingListsApi,\
ShoppingListsRecipeAppenderApi, ShoppingListRecipeAppenderApi
from recipebox.resources.auth import SignupApi, LoginApi
from recipebox.resources.scraping_manifest import ScrapingManifestApi,\
ScrapingManifestsApi


def initialize_routes(api):
    api.add_resource(RecipesApi, '/api/recipes')
    api.add_resource(RecipeApi, '/api/recipes/<id>')
    api.add_resource(ShoppingListsApi, '/api/shopping-list')
    api.add_resource(ShoppingListsRecipeAppenderApi, '/api/recipe-adder')
    api.add_resource(ShoppingListRecipeAppenderApi, '/api/recipe-adder/<id>')
    api.add_resource(ShoppingListApi, '/api/shopping-list/<id>')
    api.add_resource(SignupApi, '/api/auth/signup')
    api.add_resource(LoginApi, '/api/auth/login')
    api.add_resource(StarApi, '/api/star/<id>')
    api.add_resource(ScrapingManifestsApi, '/api/scraping-manifest')
    api.add_resource(ScrapingManifestApi, '/api/scraping-manifest/<id>')
    api.add_resource(ScrapingApi, '/api/scrape')

