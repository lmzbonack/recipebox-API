# Once mongo box is created provision users by calling 
# docker exec mongodb /bin/sh setup/scripts/activate_mongo.sh

mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD <<EOF
use recipebox
db.createUser({user: '$MONGODB_USERNAME', pwd: '$MONGODB_PASSWORD', roles: [{role: 'readWrite', db: 'recipebox'}]})
EOF
