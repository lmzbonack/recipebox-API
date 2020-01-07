class InternalServerError(Exception):
    pass

class SchemaValidationError(Exception):
    pass

class RecipeAlreadyExistsError(Exception):
    pass

class UpdatingRecipeError(Exception):
    pass

class DeletingRecipeError(Exception):
    pass

class RecipeDoesNotExistError(Exception):
    pass

class EmailAlreadyExistsError(Exception):
    pass

class UnauthorizedError(Exception):
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
         "value": "Recipe with given name already exists",
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
         "message": "recipe with given id doesn't exists",
         "status": 400
     },
     "EmailAlreadyExistsError": {
         "message": "User with given email address already exists",
         "value": "User with given email address already exists",
         "status": 400
     },
     "UnauthorizedError": {
         "message": "Invalid username or password",
         "status": 401
     }
}