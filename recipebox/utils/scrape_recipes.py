"""Create a generic class that given a url to a page that contains a recipe will return instructions, ingredients, etc"""
import requests
import time

from bs4 import BeautifulSoup
from mongoengine.errors import DoesNotExist

from recipebox.database.models import ScrapingManifest
from recipebox.resources.errors import InternalServerError, ScrapingManifestDoesNotExistError   

class RecipeBoxScraper:
    """Generic Scraper that will retrieve what it can and send back a comprehensive response"""
    def __init__(self):
        self.retrieved_data = {
            'url': None,
            'name': None,
            'author': None,
            'prep_time': None,
            'cook_time': None,
            'ingredients': [],
            'instructions': []
        }
        self.mapping = None
        self.soup = None

    def reset_retrieved_data(self):
        self.retrieved_data = {
            'url': None,
            'name': None,
            'author': None,
            'prep_time': None,
            'cook_time': None,
            'ingredients': [],
            'instructions': []
        }

    def retrieve_scraping_manifest(self, recipe_url):
        print(recipe_url)
        if recipe_url[0:4] != 'http':
            return 'Please provide the full path'
        try:
            recipe_list = recipe_url.split('/')
            smanifest = ScrapingManifest.objects.get(domain=recipe_list[2])
            self.mapping = smanifest
            return smanifest
        except DoesNotExist:
            raise ScrapingManifestDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError  

    def retrieve_url(self, recipe_url):
        recipe_index = requests.get(recipe_url)
        if recipe_index.status_code != 200:
            return 'Url could not be retrieved'
        else:
            self.retrieved_data['url'] = recipe_url
            self.soup = BeautifulSoup(recipe_index.content, 'html.parser')
            return 'Url Retrieved'

    def scrape_name(self, name_path):
        name = self.soup.find(class_ = name_path)
        if name is not None:
            self.retrieved_data['name'] = name.text
            return name.text
        else:
            return 'Could not retrieve name data'

    def scrape_author(self, author_path):
        author = self.soup.find(class_ = author_path)
        if author is not None:
            self.retrieved_data['author'] = author.text
            return author.text
        else:
            return 'Could not retrieve author data'

    def scrape_prep_time(self, prep_time_path, unit_path):
        prep_time = self.soup.find(class_ = prep_time_path)
        unit =  self.soup.find(class_ = unit_path)
        if prep_time is not None and unit is not None:
            prep_time_container = {
                'unit': unit.text,
                'value': prep_time.text
            }
            self.retrieved_data['prep_time'] = prep_time_container
            return prep_time_container
        elif prep_time is not None:
            prep_time_container = {
                'value': prep_time.text
            }
            self.retrieved_data['prep_time'] = prep_time_container
            return prep_time_container
        else:
            return 'Could not retrieve prep_time data'

    def scrape_cook_time(self, cook_time, unit_path):
        cook_time = self.soup.find(class_ = cook_time)
        unit =  self.soup.find(class_ = unit_path)
        if cook_time is not None and unit is not None:
            cook_time_container = {
                'unit': unit.text,
                'value': cook_time.text
            }
            self.retrieved_data['cook_time'] = cook_time_container
            return cook_time_container
        elif cook_time is not None:
            cook_time_container = {
                'value': cook_time.text
            }
            self.retrieved_data['cook_time'] = cook_time_container
            return cook_time_container
        else:
            return 'Could not retrieve cook_time data'

    def scrape_ingredients(self, ingredients_path):
        ingredients = self.soup.find(class_ = ingredients_path).children
        if ingredients is not None:
            ingredients_list = []
            for ingredient in ingredients:
                ingredients_list.append(ingredient.text)        

            self.retrieved_data['ingredients'] = ingredients_list
            return ingredients_list
        else:
            return 'Could not find ingredients'
    
    def scrape_instructions(self, instructions_path):
        instructions = self.soup.find(class_ = instructions_path).children
        if instructions is not None:
            instructions_list = []
            for instruction in instructions:
                instructions_list.append(instruction.text)        

            self.retrieved_data['instructions'] = instructions_list
            return instructions_list
        else:
            return 'Could not find instructions'

    def scrape_everything(self, url):
        manifest_result = self.retrieve_scraping_manifest(url) 
        
        if manifest_result == 'Please provide the full path':
            return manifest_result
        url_result = self.retrieve_url(url)
        
        if url_result != 'Url Retrieved':
            return url_result
        
        self.scrape_name(self.mapping['name_path'])
        self.scrape_author(self.mapping['author_path'])
        
        if len(self.mapping['prep_time_path']) != 0:
            self.scrape_prep_time(self.mapping['prep_time_path'][0], self.mapping['prep_time_path'][1])
        
        if len(self.mapping['cook_time_path']) != 0:
            self.scrape_cook_time(self.mapping['cook_time_path'][0], self.mapping['cook_time_path'][1])
        
        self.scrape_ingredients(self.mapping['ingredients_path'])
        self.scrape_instructions(self.mapping['instructions_path'])
        return self.retrieved_data

