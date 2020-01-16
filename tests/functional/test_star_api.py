import pytest

from recipebox.resources.errors import RecipeDoesNotExistError

def test_starring_a_recipe_fails_when_not_logged_in(test_client, init_database, add_recipe):
    star_reponse = test_client.put(f'/api/star/{add_recipe}')
    assert star_reponse.status_code == 401

def test_starring_a_non_existent_recipe_fails(test_client, init_database, retrieve_auth_token):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
    }

    with pytest.raises(RecipeDoesNotExistError) as e:
        assert test_client.put('/api/star/5e0eccabe439c556880fb91c', headers=headers)

def test_starring_a_recipe_works_when_logged_in(test_client, init_database, retrieve_auth_token, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
    }

    star_reponse = test_client.put(f'/api/star/{add_recipe}', headers=headers)

    assert star_reponse.status_code == 200

def test_starring_a_recipe_that_is_already_starred_fails(test_client, init_database, retrieve_auth_token, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
    }

    star_reponse = test_client.put(f'/api/star/{add_recipe}', headers=headers)

    assert star_reponse.status_code == 400
    assert star_reponse.data == b'"Recipe is already starred for this user"\n'

def test_unstarring_a_recipe_fails_when_not_logged_in(test_client, init_database, add_recipe):
    star_reponse = test_client.delete(f'/api/star/{add_recipe}')
    assert star_reponse.status_code == 401

def test_unstarring_a_non_existent_recipe_fails(test_client, init_database, retrieve_auth_token):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
    }

    with pytest.raises(RecipeDoesNotExistError) as e:
        assert test_client.put('/api/star/5e0eccabe439c556880fb91c', headers=headers)

def test_unstarring_a_recipe_works_when_logged_in(test_client, init_database, retrieve_auth_token, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
    }

    star_reponse = test_client.delete(f'/api/star/{add_recipe}', headers=headers)
    assert star_reponse.status_code == 200

def test_unstarring_a_recipe_that_is_already_unstarred_fails(test_client, init_database, retrieve_auth_token, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
    }
    
    star_reponse = test_client.delete(f'/api/star/{add_recipe}', headers=headers)

    assert star_reponse.status_code == 400
    assert star_reponse.data == b'"Recipe is not currently starred for this user"\n'


