import pytest, json

from recipebox.resources.errors import SchemaValidationError, ShoppingListAlreadyExistsError,\
InternalServerError, UpdatingShoppingListError, DeletingShoppingListError, ShoppingListDoesNotExistError   

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
    print(response.data) 
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
