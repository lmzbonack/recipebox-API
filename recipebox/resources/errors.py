from flask_restful import HTTPException

class InternalServerError(HTTPException):
    pass

class ShoppingListAlreadyExistsError(HTTPException):
    pass

class ShoppingListDoesNotExistError(HTTPException):
    pass

class UpdatingShoppingListError(HTTPException):
    pass

class DeletingShoppingListError(HTTPException):
    pass

class SchemaValidationError(HTTPException):
    pass

class RecipeAlreadyExistsError(HTTPException):
    pass

class UpdatingRecipeError(HTTPException):
    pass

class DeletingRecipeError(HTTPException):
    pass

class RecipeDoesNotExistError(HTTPException):
    pass

class ScrapingManifestAlreadyExistsError(HTTPException):
    pass

class UpdatingScrapingManifestError(HTTPException):
    pass

class DeletingScrapingManifestError(HTTPException):
    pass

class ScrapingManifestDoesNotExistError(HTTPException):
    pass

class EmailAlreadyExistsError(HTTPException):
    pass

class EmailDoesNotExistError(HTTPException):
    pass

class BadTokenError(HTTPException):
    pass

class UnauthorizedError(HTTPException):
    pass

errors = {
    "InternalServerError": {
        "message": "Something went wrong",
        "status": 500
    },
    "SchemaValidationError": {
        "message": "Request is missing required fields",
        "status": 400
    },
    "RecipeAlreadyExistsError": {
        "message": "Recipe with given name already exists",
        "status": 400
    },
    "UpdatingRecipeError": {
        "message": "Updating recipe added by other is forbidden",
        "status": 403
    },
    "DeletingRecipeError": {
        "message": "Deleting recipe added by other is forbidden",
        "status": 403
    },
    "RecipeDoesNotExistError": {
        "message": "Recipe with given id doesn't exists",
        "status": 400
    },
    "ScrapingManifestAlreadyExistsError": {
        "message": "Scraping Manifest with given name already exists",
        "status": 400
    },
    "ScrapingManifestRecipeError": {
        "message": "Updating Scraping Manifest added by other is forbidden",
        "status": 403
    },
    "DeletingScrapingManifestError": {
        "message": "Deleting Scraping Manifest added by other is forbidden",
        "status": 403
    },
    "ScrapingManifestDoesNotExistError": {
        "message": "Scraping Manifest with given id doesn't exists",
        "status": 400
    },
    "EmailAlreadyExistsError": {
        "message": "User with given email address already exists",
        "status": 400
    },
    "UnauthorizedError": {
        "message": "Invalid username or password",
        "status": 401
    },
    "ShoppingListAlreadyExistsError": {
        "message": "Shopping list with given id doesn't exists",
        "status": 400
    },
    "ShoppingListDoesNotExistError": {
        "message": "Shopping list with given id doesn't exists",
        "status": 400
    },
    "UpdatingShoppingListError": {
        "message": "Updating shopping list added by other is forbidden",
        "status": 403
    },
    "DeletingShoppingListError": {
        "message": "Deleting shopping list added by other is forbidden",
        "status": 403
    },
    "EmailDoesNotExistError": {
        "message": "Couldn't find the user with given email address",
        "status": 400
    },
    "BadTokenError": {
        "message": "Invalid token",
        "status": 403
    }
      
}
