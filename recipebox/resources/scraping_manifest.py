from flask import Blueprint, Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist,\
ValidationError, InvalidQueryError

from recipebox.database.models import ScrapingManifest, User
from recipebox.resources.errors import SchemaValidationError, ScrapingManifestAlreadyExistsError,\
InternalServerError, UpdatingScrapingManifestError, DeletingScrapingManifestError, ScrapingManifestDoesNotExistError   

class ScrapingManifestsApi(Resource):
    @jwt_required
    def get(self):
        smanifest = ScrapingManifest.objects().to_json()
        return Response(smanifest, mimetype="application/json", status=200)

    @jwt_required
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)
            smanifest = ScrapingManifest(**body, created_by=user).save()
            user.update(push__authored_scraping_manifests=smanifest)
            user.save()
            id = smanifest.id
            return {'id': str(id)}, 201
        except (FieldDoesNotExist, ValidationError):
            raise SchemaValidationError
        except NotUniqueError:
            raise ScrapingManifestAlreadyExistsError
        except Exception as e:
            print(e)
            raise InternalServerError

class ScrapingManifestApi(Resource):
    @jwt_required
    def get(self, id):
        try:
            smanifest = ScrapingManifest.objects.get(id=id).to_json()
            return Response(smanifest, mimetype="application/json", status=200)
        except DoesNotExist:
            raise ScrapingManifestDoesNotExistError
        except Exception as e:
            print(e)
            raise InternalServerError   

    @jwt_required
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            smanifest = ScrapingManifest.objects.get(id=id, created_by=user_id)
            body = request.get_json()
            ScrapingManifest.objects.get(id=id).update(**body)
            smanifest = ScrapingManifest.objects.get(id=id, created_by=user_id).to_json()
            return Response(smanifest, mimetype="application/json", status=200)
        except InvalidQueryError:
            raise SchemaValidationError
        except DoesNotExist:
            raise UpdatingScrapingManifestError
        except Exception as e:
            print(e)
            raise InternalServerError
    
    @jwt_required
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            smanifest = ScrapingManifest.objects.get(id=id, created_by=user_id)
            smanifest.delete()
            return '', 204
        except DoesNotExist:
            raise DeletingScrapingManifestError
        except Exception as e:
            print(e)
            raise InternalServerError
       