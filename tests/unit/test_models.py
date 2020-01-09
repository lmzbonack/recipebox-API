import pytest

from recipebox.database.models import Recipe, User

def test_new_user(new_user):
    """
    GIVEN a User model
    WHEN as new User is created
    THEN check the email, password and recipes fields
    """
    assert new_user.email == 'jim@raynor.com'
    assert new_user.password == 'hashed'
    new_user.hash_password()
    assert new_user.password != 'hashed'
    assert new_user.recipes == []

def test_user_signin(new_user):
    """
    GIVEN a User that has been successfully created
    WHEN that user tries to sign in
    THEN the password checking function works correctly
    """
    assert new_user.check_password('totally secure') == False
    assert new_user.check_password('hashed') == True

def test_new_recipe(new_user, new_recipe):
    """
    GIVEN a Recipe model
    WHEN a recipe is created
    THEN check the name, author, ingredients, instructions, and created_by field
    """
    assert new_recipe.name == 'Cozy Chili Cornbread Skillet'
    assert new_recipe.author == 'Beth'
    assert new_recipe.created_by == new_user
