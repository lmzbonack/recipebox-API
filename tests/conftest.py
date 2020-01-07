import pytest
from pymongo import MongoClient

from recipebox import create_app
from recipebox.database.models import Recipe, User

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app('flask_test.cfg')
    test_client = flask_app.test_client()
    ctx = flask_app.app_context()
    ctx.push()
    yield test_client
    ctx.pop()

@pytest.fixture(scope='module')
def init_database():
    # This is a non-ideal approach because it uses a different
    # library in order to teardown the connection after it is used
    client = MongoClient('mongodb://localhost:27017/')
    with client:
        db = client.test
        db.user.drop()
    


@pytest.fixture(scope='module')
def new_user():
    test_user = User(
        email='jim@raynor.com', 
        password='hashed'
    )
    return test_user

@pytest.fixture(scope='module')
def new_recipe(new_user):
    test_recipe = Recipe(
        name='Cozy Chili Cornbread Skillet', 
        author='Beth',
        ingredients=[ 
            '1 Tbsp cooking oil', 
            '2 cloves garlic',
            '1 yellow onion',
            '1 jalapeño (optional)',
            '1 15 oz. can fire roasted diced tomatoes',
            '1 6 oz. can tomato paste',
            '3 15 oz. cans beans (kidney, pinto, black)',
            '1 Tbsp chili powder',
            '1 tsp cumin',
            '1/2 tsp oregano',
            '1 tsp salt',
            '1 cup water',
            '1 cup shredded cheddar'
        ],
        instructions=[ 
    	    'Dice the onion and mince the garlic. Slice the jalapeño lengthwise, scrape out the seeds, and then dice the pepper.\
             Add the cooking oil, onion, garlic, and jalapeño to a large 4-quart oven safe skillet. Sauté over medium heat until\
             the onions are soft and translucent (about 5 minutes).',
    	    'Drain the canned beans then add them to the skillet with the tomato paste, diced tomatoes, chili powder, cumin, oregano,\
            salt, and water. Stir to combine.',
            'Allow the chili to come up to a simmer. Let the chili continue to simmer, stirring occasionally, as you prepare the cornbread topping.',
            'Begin to preheat the oven to 425ºF. In a large bowl, stir together the cornmeal, flour, sugar, baking powder, and salt until very \
            well combined. In a separate bowl, whisk together the milk, egg, and oil. Pour the milk mixture into the bowl with the cornmeal mixture \
            and stir just until everything is moistened.',
            'Sprinkle the cheddar cheese over top of the simmering chili. Carefully pour the cornbread batter over the chili and cheese, and spread it around \
            until the surface is evenly covered.',
            'Transfer the skillet to the fully preheated oven and bake for 25 minutes, or until the cornbread is golden brown on the surface. \
            To serve, simply scoop the cornbread and chili beneath onto a plate or bowl, and enjoy!'
        ],
        created_by=new_user
    )
    return test_recipe