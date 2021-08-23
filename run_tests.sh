docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

docker-compose exec integration_tests npm test

docker-compose -f docker-compose.yml -f docker-compose.test.yml down