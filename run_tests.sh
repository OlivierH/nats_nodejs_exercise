echo "Setting up the stack..."
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d


echo "Waiting 3 seconds for everything to be up..."
sleep 3

docker-compose -f docker-compose.yml -f docker-compose.test.yml exec integration_tests npm test

echo "Tearing down the stack..."
docker-compose -f docker-compose.yml -f docker-compose.test.yml down