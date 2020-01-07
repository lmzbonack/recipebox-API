import json, pytest

from recipebox.resources.errors import SchemaValidationError, EmailAlreadyExistsError, UnauthorizedError, \
InternalServerError

def test_register_new_user(test_client, init_database):
    test_data = {
        'email': 'lmzbonack@gmail.com',
	    'password': 'secure'  
    }

    response = test_client.post('/api/auth/signup', data=json.dumps(test_data), content_type='application/json')
    assert response.status_code == 201
    #assert 'id' in response.data
    dict_res = json.loads(response.data)
    assert dict_res['id'] is not None

def test_registering_user_with_duplicate_email_fails(test_client, init_database):
    with pytest.raises(EmailAlreadyExistsError) as e:
        test_data = {
            'email': 'lmzbonack@gmail.com',
            'password': 'secure'  
        }
        # Post to our register route which will trigger an EmailAlreadyExistsError which we defined above
        assert test_client.post('/api/auth/signup', data=json.dumps(test_data), content_type='application/json')

def test_registering_user_with_invalid_field(test_client, init_database):
    with pytest.raises(SchemaValidationError) as e:
        test_data = {
            'email': 'lzbonack@gmail.com',
            'password': 'secure',
            'kittes': 'fluffy'  
        }
        # Post to our register route which will trigger a SchemaValidationError which we defined above
        assert test_client.post('/api/auth/signup', data=json.dumps(test_data), content_type='application/json')

def test_login_with_registered_user(test_client, init_database):
    test_data = {
        'email': 'lmzbonack@gmail.com',
	    'password': 'secure'  
    }

    response = test_client.post('/api/auth/login', data=json.dumps(test_data), content_type='application/json')
    assert response.status_code == 201
    #assert 'id' in response.data
    dict_res = json.loads(response.data)
    assert dict_res['token'] is not None

def test_login_with_unregistered_user(test_client, init_database):
    with pytest.raises(UnauthorizedError) as e:
        test_data = {
            'email': 'lzbonack@gmail.com',
            'password': 'secure'  
        }
        # Post to our login route which will trigger an UnauthorizedError which we defined above
        assert test_client.post('/api/auth/login', data=json.dumps(test_data), content_type='application/json')

