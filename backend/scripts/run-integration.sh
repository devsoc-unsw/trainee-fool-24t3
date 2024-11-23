#This script only works for integration testing.
DIR="$(cd "$(dirname "$0")" && pwd)"
export $(grep -v '^#' .env.test | xargs)
docker-compose up -d
docker rm -f redis-stack-test 2>/dev/null || true && docker run -d --name redis-stack-test -p 6380:6379 -p 8002:8001 redis/redis-stack:latest
echo '🟡 - Waiting for database to be ready...'
echo "node_env is ${NODE_ENV}"
echo "Using database: ${DATABASE_URL}"
echo "redis port is ${REDIS_PORT}"
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name init
if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts
else
    vitest -c ./vitest.config.integration.ts --ui
fi