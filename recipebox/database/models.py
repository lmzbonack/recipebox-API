from flask_bcrypt import generate_password_hash, check_password_hash

from recipebox.database.db import db

class Recipe(db.Document):
    name = db.StringField(required=True, unique=True)
    author = db.StringField(required=True)
    ingredients = db.ListField(db.StringField(), required=True)
    instructions = db.ListField(db.StringField(), required=True)
    created_by = db.ReferenceField('User')

class User(db.Document):
    email = db.EmailField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    recipes = db.ListField(db.ReferenceField('Recipe', reverse_delete_rule=db.PULL))

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

User.register_delete_rule(Recipe, 'added_by', db.CASCADE)
