import json, pytest

from recipebox.resources.errors import SchemaValidationError, RecipeAlreadyExistsError,\
InternalServerError, UpdatingRecipeError, DeletingRecipeError, RecipeDoesNotExistError  

def test_retrieve_all_recipes(retrieve_auth_token, test_client, init_database, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token)
    }
    
    response = test_client.get('/api/recipes', headers=headers)
    assert response.status_code == 200
    dict_res = json.loads(response.data)
    print(dict_res)
    dict_res[0]['name'] = 'Cozy Cornbread Skillet'
    dict_res[0]['author'] = 'Beth'

def test_retrieving_all_recipes_without_auth_fails(retrieve_auth_token, test_client, init_database, add_recipe):
    response = test_client.get('/api/recipes')
    assert response.status_code == 401

def test_posting_recipe_with_extra_data_fails(retrieve_auth_token, test_client, init_database):
    with pytest.raises(SchemaValidationError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'origin': 'Kitties',
            'name': 'Garlic Beef Noodles',
            'author': 'Luc',
            'ingredients': [ 
                '12 oz. Lo-Mein Noodles', 
                '3 cloves garlic',
                '1 lb. of beef chunks',
                '4 green onions',
                '2 Tbsp. brown sugar',
                '2 Tbsp. soy sauce',
                '2 Tbsp. butter'
            ],
            'instructions': [ 
                'Slice the green onions and mince the garlic, then sautee them in the butter',
                'While this is happening prepare the pasta',
                'Add the beef to the pan and cook until almost done',
                'Add the soy sauce and brown sugar',
                'Mix in the pasta'
            ]
        }

        assert test_client.post('api/recipes', headers=headers, data=json.dumps(test_data))

def test_posting_recipe_works(retrieve_auth_token, test_client, init_database):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }

    test_data = {
        'name': 'Garlic Beef Noodles',
        'author': 'Luc',
        'ingredients': [ 
            '12 oz. Lo-Mein Noodles', 
            '3 cloves garlic',
            '1 lb. of beef chunks',
            '4 green onions',
            '2 Tbsp. brown sugar',
            '2 Tbsp. soy sauce',
            '2 Tbsp. butter'
        ],
        'instructions': [ 
            'Slice the green onions and mince the garlic, then sautee them in the butter',
            'While this is happening prepare the pasta',
            'Add the beef to the pan and cook until almost done',
            'Add the soy sauce and brown sugar',
            'Mix in the pasta'
        ]
    }

    response = test_client.post('api/recipes', headers=headers, data=json.dumps(test_data))

    assert response.status_code == 201
    
    dict_res = json.loads(response.data)
    assert dict_res['id'] is not None

def test_posting_duplicate_recipe_fails(retrieve_auth_token, test_client, init_database):
    with pytest.raises(RecipeAlreadyExistsError) as e:

        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }

        test_data = {
            'name': 'Garlic Beef Noodles',
            'author': 'Luc',
            'ingredients': [ 
                '12 oz. Lo-Mein Noodles', 
                '3 cloves garlic',
                '1 lb. of beef chunks',
                '4 green onions',
                '2 Tbsp. brown sugar',
                '2 Tbsp. soy sauce',
                '2 Tbsp. butter'
            ],
            'instructions': [ 
                'Slice the green onions and mince the garlic, then sautee them in the butter',
                'While this is happening prepare the pasta',
                'Add the beef to the pan and cook until almost done',
                'Add the soy sauce and brown sugar',
                'Mix in the pasta'
            ]
        }
        
        assert test_client.post('api/recipes', headers=headers, data=json.dumps(test_data))

def test_updating_a_recipe_works(retrieve_auth_token, test_client, init_database, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token),
        'Content-Type': 'application/json'
    }
    
    test_data = {
        'name': 'Dank Chili Cornbread Skillet',
        'author': 'Luc',
        'ingredients': [ 
            '1 Tbsp cooking oil', 
            '2 cloves garlic',
            '1 yellow onion',
            '1 15 oz. can fire roasted diced tomatoes',
            '1 6 oz. can tomato paste',
            '3 15 oz. cans beans (kidney, pinto, black)',
            '1 Tbsp chili powder',
            '1 tsp cumin',
            '1/2 tsp oregano',
            '1 tsp salt',
            '1 cup water'
        ],
        'instructions': [ 
            'Dice the onion and mince the garlic. Slice the jalapeño lengthwise, scrape out the seeds, and then dice the pepper. Add the cooking oil, onion, garlic, and jalapeño to a large 4-quart oven safe skillet. Sauté over medium heat until the onions are soft and translucent (about 5 minutes).',
            'Drain the canned beans then add them to the skillet with the tomato paste, diced tomatoes, chili powder, cumin, oregano, salt, and water. Stir to combine.',
            'Allow the chili to come up to a simmer. Let the chili continue to simmer, stirring occasionally, as you prepare the cornbread topping.',
            'Begin to preheat the oven to 425ºF. In a large bowl, stir together the cornmeal, flour, sugar, baking powder, and salt until very well combined. In a separate bowl, whisk together the milk, egg, and oil. Pour the milk mixture into the bowl with the cornmeal mixture and stir just until everything is moistened.',
            'Sprinkle the cheddar cheese over top of the simmering chili. Carefully pour the cornbread batter over the chili and cheese, and spread it around until the surface is evenly covered.',
            'Transfer the skillet to the fully preheated oven and bake for 25 minutes, or until the cornbread is golden brown on the surface. To serve, simply scoop the cornbread and chili beneath onto a plate or bowl, and enjoy!'
        ]
    }
    response = test_client.put('api/recipes/{}'.format(add_recipe), headers=headers, data=json.dumps(test_data))
    assert response.status_code == 200

    #Check the response
    new_res = test_client.get('api/recipes/{}'.format(add_recipe), headers=headers)
    res_dict = json.loads(new_res.data)
    print(res_dict)
    assert res_dict['name'] == 'Dank Chili Cornbread Skillet'
    assert res_dict['author'] == 'Luc'
    assert res_dict['ingredients'] == test_data['ingredients']

def test_updating_a_recipe_owned_by_a_separate_user_fails(retrieve_invalid_auth_token, test_client, init_database, add_recipe):
    with pytest.raises(UpdatingRecipeError) as e:
    
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_invalid_auth_token),
            'Content-Type': 'application/json'
        }
        
        test_data = {
            'name': 'Dank Chili Cornbread Skillet',
            'author': 'Luc',
            'ingredients': [ 
                '1 Tbsp cooking oil', 
                '2 cloves garlic',
                '1 yellow onion',
                '1 15 oz. can fire roasted diced tomatoes',
                '1 6 oz. can tomato paste',
                '3 15 oz. cans beans (kidney, pinto, black)',
                '1 Tbsp chili powder',
                '1 tsp cumin',
                '1/2 tsp oregano',
                '1 tsp salt',
                '1 cup water'
            ],
            'instructions': [ 
                'Dice the onion and mince the garlic. Slice the jalapeño lengthwise, scrape out the seeds, and then dice the pepper. Add the cooking oil, onion, garlic, and jalapeño to a large 4-quart oven safe skillet. Sauté over medium heat until the onions are soft and translucent (about 5 minutes).',
                'Drain the canned beans then add them to the skillet with the tomato paste, diced tomatoes, chili powder, cumin, oregano, salt, and water. Stir to combine.',
                'Allow the chili to come up to a simmer. Let the chili continue to simmer, stirring occasionally, as you prepare the cornbread topping.',
                'Begin to preheat the oven to 425ºF. In a large bowl, stir together the cornmeal, flour, sugar, baking powder, and salt until very well combined. In a separate bowl, whisk together the milk, egg, and oil. Pour the milk mixture into the bowl with the cornmeal mixture and stir just until everything is moistened.',
                'Sprinkle the cheddar cheese over top of the simmering chili. Carefully pour the cornbread batter over the chili and cheese, and spread it around until the surface is evenly covered.',
                'Transfer the skillet to the fully preheated oven and bake for 25 minutes, or until the cornbread is golden brown on the surface. To serve, simply scoop the cornbread and chili beneath onto a plate or bowl, and enjoy!'
            ]
        }

        assert test_client.put('api/recipes/{}'.format(add_recipe), headers=headers, data=json.dumps(test_data))
 
# Probably should randomly generate a 24 character hex string to use for this and check that it is not
# the valid ID as unlikely as that is
def test_updating_a_recipe_fails_with_invalid_id_fails(retrieve_auth_token, test_client, init_database):
    with pytest.raises(UpdatingRecipeError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token),
            'Content-Type': 'application/json'
        }
    
        test_data = {
            'name': 'Dank Chili Cornbread Skillet',
            'author': 'Luc',
            'ingredients': [ 
                '1 Tbsp cooking oil', 
                '2 cloves garlic',
                '1 yellow onion',
                '1 15 oz. can fire roasted diced tomatoes',
                '1 6 oz. can tomato paste',
                '3 15 oz. cans beans (kidney, pinto, black)',
                '1 Tbsp chili powder',
                '1 tsp cumin',
                '1/2 tsp oregano',
                '1 tsp salt',
                '1 cup water'
            ],
            'instructions': [ 
                'Dice the onion and mince the garlic. Slice the jalapeño lengthwise, scrape out the seeds, and then dice the pepper. Add the cooking oil, onion, garlic, and jalapeño to a large 4-quart oven safe skillet. Sauté over medium heat until the onions are soft and translucent (about 5 minutes).',
                'Drain the canned beans then add them to the skillet with the tomato paste, diced tomatoes, chili powder, cumin, oregano, salt, and water. Stir to combine.',
                'Allow the chili to come up to a simmer. Let the chili continue to simmer, stirring occasionally, as you prepare the cornbread topping.',
                'Begin to preheat the oven to 425ºF. In a large bowl, stir together the cornmeal, flour, sugar, baking powder, and salt until very well combined. In a separate bowl, whisk together the milk, egg, and oil. Pour the milk mixture into the bowl with the cornmeal mixture and stir just until everything is moistened.',
                'Sprinkle the cheddar cheese over top of the simmering chili. Carefully pour the cornbread batter over the chili and cheese, and spread it around until the surface is evenly covered.',
                'Transfer the skillet to the fully preheated oven and bake for 25 minutes, or until the cornbread is golden brown on the surface. To serve, simply scoop the cornbread and chili beneath onto a plate or bowl, and enjoy!'
            ]
        }
    
        assert test_client.put('api/recipes/5e0eccabe439c556880fb91c', headers=headers, data=json.dumps(test_data)) 

def test_fetching_a_single_recipe_works(test_client, init_database, add_recipe):
    response = test_client.get('api/recipes/{}'.format(add_recipe))
    assert response.status_code == 200
    res_dict = json.loads(response.data)
    assert res_dict['name'] == 'Dank Chili Cornbread Skillet'
    assert res_dict['author'] == 'Luc'

def test_fetching_a_single_nonexistent_recipe_fails(test_client, init_database):
    with pytest.raises(RecipeDoesNotExistError) as e:
        assert test_client.get('/api/recipes/5e0eccabe439c556880fb91c')

def test_deleting_a_recipe_without_auth_fails(test_client, init_database, add_recipe):
    response = test_client.delete('/api/recipes/{}'.format(add_recipe))
    assert response.status_code == 401

def test_deleting_a_recipe_owned_by_a_separate_user_fails(retrieve_invalid_auth_token, test_client, init_database, add_recipe):
    with pytest.raises(DeletingRecipeError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_invalid_auth_token)
        }

        response = test_client.delete('/api/recipes/{}'.format(add_recipe), headers=headers)

def test_deleting_a_recipe_with_auth_succeeds(retrieve_auth_token, test_client, init_database, add_recipe):
    headers = {
        'Authorization': 'Bearer {}'.format(retrieve_auth_token)
    }

    response = test_client.delete('/api/recipes/{}'.format(add_recipe), headers=headers)

    assert response.status_code == 204

def test_deleting_a_non_existent_recipe_fails(retrieve_auth_token, test_client, init_database, add_recipe):
    with pytest.raises(DeletingRecipeError) as e:
        headers = {
            'Authorization': 'Bearer {}'.format(retrieve_auth_token)
        }

        assert test_client.delete('/api/recipes/5e0eccabe439c556880fb91c', headers=headers)

