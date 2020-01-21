from recipebox.resources.recipe import RecipesApi, RecipeApi, StarApi
from recipebox.resources.shopping_list import ShoppingListApi, ShoppingListsApi
from recipebox.resources.auth import SignupApi, LoginApi


def initialize_routes(api):
    api.add_resource(RecipesApi, '/api/recipes')
    api.add_resource(RecipeApi, '/api/recipes/<id>')
    api.add_resource(ShoppingListsApi, '/api/shopping-list')
    api.add_resource(ShoppingListApi, '/api/shopping-list/<id>')
    api.add_resource(SignupApi, '/api/auth/signup')
    api.add_resource(LoginApi, '/api/auth/login')
    api.add_resource(StarApi, '/api/star/<id>')
