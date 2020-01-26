import pytest, json

from recipebox.resources.errors import SchemaValidationError, ShoppingListAlreadyExistsError,\
InternalServerError, UpdatingShoppingListError, DeletingShoppingListError, ShoppingListDoesNotExistError,\
RecipeDoesNotExistError   

def test_retrieving_a_single_shopping_list_works(test_client, init_database, add_shopping_list, new_user):
    response = test_client.get('api/shopping-list/{}'.format(add_shopping_list))
    assert response.status_code == 200
    res_dict = json.loads(response.data)
    assert res_dict['name'] == 'Main List'
    assert res_dict['added_recipes'] == []
    assert res_dict['ingredients'] == []

def test_retrieving_a_single_nonexistent_shopping_list_fails(test_client, init_database):
    with pytest.raises(ShoppingListDoesNotExistError) as e:
        assert test_client.get('/api/shopping-list/5e0eccabe439c556880fb91c')


def test_posting_shopping_list_with_extra_data_fails(retrieve_auth_token, test_client, init_database):
    with pytest.raises(SchemaValidationError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'name':'New List',
            'added_recipes':[],
            'ingredients': [],
            'kitties': 'Fluffy'
        }

        assert test_client.post('api/shopping-list', headers=headers, data=json.dumps(test_data))

def test_posting_shopping_list_works(test_client, init_database, retrieve_auth_token):
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'name':'New List',
            'added_recipes':[],
            'ingredients': [],
        }

        response = test_client.post('api/shopping-list', headers=headers, data=json.dumps(test_data))
        assert response.status_code == 201

def test_updating_a_shopping_list_with_invalid_id_fails(retrieve_auth_token, test_client, init_database):
    with pytest.raises(UpdatingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }
    
        test_data = {
            'name':'New List',
            'added_recipes':[],
            'ingredients': [],
        }
    
        assert test_client.put('api/shopping-list/5e0eccabe439c556880fb91a', headers=headers, data=json.dumps(test_data)) 


def test_updating_a_shopping_list_works(retrieve_auth_token, test_client, init_database, add_shopping_list):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'name':'Newest List',
        'added_recipes':[],
        'ingredients': [],
    }

    response = test_client.put('api/shopping-list/{}'.format(add_shopping_list), headers=headers, data=json.dumps(test_data))

    response.status_code == 200

    res_dict = json.loads(response.data)
    assert res_dict['name'] == 'Newest List'
    assert res_dict['added_recipes'] == []
    assert res_dict['ingredients'] == []

def test_updating_a_shopping_list_owned_by_a_separate_user_fails(retrieve_invalid_auth_token, test_client, init_database, add_shopping_list):
    with pytest.raises(UpdatingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_invalid_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'name':'Newest List',
            'added_recipes':[],
            'ingredients': [],
        }
        
        assert test_client.put('api/shopping-list/{}'.format(add_shopping_list), headers=headers, data=json.dumps(test_data))


def test_appending_a_recipe_to_create_a_shopping_list_works(retrieve_auth_token, test_client, init_database, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'recipe_id': add_recipe,
    	"name": "Dank Recipes"
    }

    response = test_client.post('api/recipe-adder', headers=headers, data=json.dumps(test_data))

    res_dict = json.loads(response.data)
    
    assert res_dict['id'] != None
    assert response.status_code == 201

def test_appending_an_invalid_recipe_to_create_a_shopping_list_fails(retrieve_auth_token, test_client, init_database):
    with pytest.raises(RecipeDoesNotExistError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }
        
        test_data = {
            'recipe_id': '5e0eccabe439c556880fb91c',
            'name': 'Dank Recipes'
        }

        assert test_client.post('api/recipe-adder', headers=headers, data=json.dumps(test_data))

def test_appending_a_recipe_wth_invalid_schema_to_create_a_shopping_list_fails(retrieve_auth_token, test_client, init_database, add_recipe):
    with pytest.raises(SchemaValidationError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }
        
        test_data = {
            'recipe_id': add_recipe,
            'name': ['Dank Recipes']
        }

        assert test_client.post('api/recipe-adder', headers=headers, data=json.dumps(test_data))

def test_appending_a_recipe_works(retrieve_auth_token, test_client, init_database, add_recipe, add_shopping_list):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'recipe_id': add_recipe,
    }
    
    response = test_client.put(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

    res_dict = json.loads(response.data)
    assert response.status_code == 200
    assert len(res_dict['added_recipes']) > 0

def test_appending_a_recipe_that_already_is_appended_fails(retrieve_auth_token, test_client, init_database, add_recipe, add_shopping_list):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'recipe_id': add_recipe,
    }

    response = test_client.put(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

    res_dict = json.loads(response.data)

    assert res_dict == 'Recipe is already in the shopping cart'
    assert response.status_code == 400


def test_appending_a_recipe_that_does_not_exist_fails(retrieve_auth_token, test_client, init_database, add_shopping_list):
    with pytest.raises(UpdatingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'recipe_id': '5e0eccabe439c556880fb91c'
        }

        assert test_client.put(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

def test_appending_a_recipe_to_a_shopping_cart_that_does_not_exist_fails(retrieve_auth_token, test_client, init_database, add_recipe):
    with pytest.raises(UpdatingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'recipe_id': add_recipe
        }

        assert test_client.put('api/recipe-adder/5e0eccabe439c556880fb91c', headers=headers, data=json.dumps(test_data))

def test_appending_a_recipe_to_non_owned_shopping_cart_fails(retrieve_invalid_auth_token, test_client, init_database, add_recipe, add_shopping_list):
    with pytest.raises(UpdatingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_invalid_auth_token),
            'Content-Type': 'application/json'  
        }

        test_data = {
            'recipe_id': add_recipe
        }

        assert test_client.put(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

#-----
def test_deleting_a_recipe_that_does_not_exist_fails(retrieve_auth_token, test_client, init_database, add_shopping_list):
    with pytest.raises(DeletingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'recipe_id': '5e0eccabe439c556880fb91c'
        }

        assert test_client.delete(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

def test_deleting_a_recipe_from_a_shopping_cart_that_does_not_exist_fails(retrieve_auth_token, test_client, init_database, add_recipe):
    with pytest.raises(DeletingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'recipe_id': add_recipe
        }

        assert test_client.delete('api/recipe-adder/5e0eccabe439c556880fb91c', headers=headers, data=json.dumps(test_data))

def test_deleting_a_recipe_from_a_non_owned_shopping_cart_fails(retrieve_invalid_auth_token, test_client, init_database, add_recipe, add_shopping_list):
    with pytest.raises(DeletingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_invalid_auth_token),
            'Content-Type': 'application/json'  
        }

        test_data = {
            'recipe_id': add_recipe
        }

        assert test_client.delete(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

def test_deleting_a_recipe_works(retrieve_auth_token, test_client, init_database, add_recipe, add_shopping_list):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'recipe_id': add_recipe
    }
    
    response = test_client.delete(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

    res_dict = json.loads(response.data)
    assert response.status_code == 200
    assert len(res_dict['added_recipes']) == 0

def test_deleting_a_recipe_that_is_not_already_appended_fails(retrieve_auth_token, test_client, init_database, add_recipe, add_shopping_list):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'recipe_id': add_recipe
    }

    response = test_client.delete(f'api/recipe-adder/{add_shopping_list}', headers=headers, data=json.dumps(test_data))

    res_dict = json.loads(response.data)

    assert res_dict == 'Recipe is not currently in the shopping cart'
    assert response.status_code == 400
#-----

def test_deleting_a_shopping_list_without_auth_fails(test_client, init_database, add_shopping_list):
    response = test_client.delete('/api/shopping-list/{}'.format(add_shopping_list))
    assert response.status_code == 401

def test_deleting_a_shopping_list_owned_by_a_separate_user_fails(retrieve_invalid_auth_token, test_client, init_database, add_shopping_list):
    with pytest.raises(DeletingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_invalid_auth_token)
        }

        response = test_client.delete('/api/shopping-list/{}'.format(add_shopping_list), headers=headers)

def test_deleting_a_shopping_list_with_auth_succeeds(retrieve_auth_token, test_client, init_database, add_shopping_list):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token)
    }

    response = test_client.delete('/api/shopping-list/{}'.format(add_shopping_list), headers=headers)

    assert response.status_code == 204

def test_deleting_a_non_existent_shopping_list_fails(retrieve_auth_token, test_client, init_database, add_shopping_list):
    with pytest.raises(DeletingShoppingListError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token)
        }

        assert test_client.delete('/api/shopping-list/5e0eccabe439c556880fb91c', headers=headers)
