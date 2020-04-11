import datetime

from flask_bcrypt import generate_password_hash, check_password_hash
from flask_mongoengine import MongoEngine
from mongoengine import signals

db = MongoEngine()

class Recipe(db.Document):
    created = db.DateTimeField(required=True, default=datetime.datetime.utcnow)
    modified = db.DateTimeField()
    created_by = db.ReferenceField('User')
    name = db.StringField(required=True, unique=True)
    author = db.StringField(required=True)
    external_link = db.StringField(),
    prep_time = db.IntField()
    cook_time = db.IntField()
    ingredients = db.ListField(db.StringField(), required=True)
    instructions = db.ListField(db.StringField(), required=True)

    @classmethod
    def update_timestamp(cls, sender, document, **kwargs):
        print('Signal Fired')
        document.modified = datetime.datetime.utcnow()

# validate domain field so it is in this format
# www.budgetbytes.com
class ScrapingManifest(db.Document):
    created_by = db.ReferenceField('User')
    domain = db.StringField(required=True, unique=True)
    name_path = db.StringField(required=True)
    author_path = db.StringField(required=True)
    prep_time_path = db.ListField(db.StringField())
    cook_time_path = db.ListField(db.StringField())
    ingredients_path = db.StringField(required=True)
    instructions_path = db.StringField(required=True)

class User(db.Document):
    email = db.EmailField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    authored_recipes = db.ListField(db.ReferenceField('Recipe', reverse_delete_rule=db.PULL))
    authored_scraping_manifests = db.ListField(db.ReferenceField('ScrapingManifest', reverse_delete_rule=db.PULL))
    starred_recipes = db.ListField(db.ReferenceField('Recipe', reverse_delete_rule=db.DO_NOTHING))

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

User.register_delete_rule(Recipe, 'added_by', db.CASCADE)

class ShoppingList(db.Document):
    owner = db.ReferenceField('User')
    name = db.StringField(required=True)
    added_recipes = db.ListField(db.ReferenceField('Recipe', reverse_delete_rule=db.DO_NOTHING))
    ingredients = db.ListField(db.StringField())

signals.post_save.connect(Recipe.update_timestamp, sender=Recipe)
