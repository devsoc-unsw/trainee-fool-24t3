DIR="$(cd "$(dirname "$0")" && pwd)"
export $(grep -v '^#' .env.test | xargs)
docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
echo "node_env is ${NODE_ENV}"
echo "Using database: ${TEST_URL}"
$DIR/wait-for-it.sh "${TEST_URL}" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name init

if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts
else
    vitest -c ./vitest.config.integration.ts --ui
fi