#This script only works for integration testing.
DIR="$(cd "$(dirname "$0")" && pwd)"
export $(grep -v '^#' .env.test | xargs)
docker rm -f postgres-test-pyramids 2>/dev/null && docker run --name postgres-test-pyramids -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
docker rm -f redis-stack-test-pyramids 2>/dev/null || true && docker run -d --name redis-stack-test-pyramids -p 6380:6379 -p 8002:8001 redis/redis-stack:latest

echo "node_env is ${NODE_ENV}"
echo "Using database: ${DATABASE_URL}"
echo "And direct URL: ${DIRECT_URL}"
echo "redis port is ${REDIS_PORT}"

pnpm prisma migrate deploy

if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts
else
    vitest -c ./vitest.config.integration.ts --ui
fi
