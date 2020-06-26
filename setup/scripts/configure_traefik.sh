# hardcode our domain here
export DOMAIN=recipebox.dev

echo "Configuring docker..."
docker network inspect proxy >/dev/null || docker network create proxy

echo "Changing file permissions for traefik"
chmod 600 /var/www/recipebox-API/traefik/acme/acme.json

echo "Building containers"
docker-compose build --no-cache

echo "Starting containers"
docker-compose up -d --force-recreate 
echo "Containers up"

echo "Creating Mongo Users"
docker exec mongodb /bin/sh setup/scripts/activate_mongo.sh
echo "Done"
