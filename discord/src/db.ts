import { createClient } from 'redis';
const { REDIS_URL } = process.env;

if (!REDIS_URL) {
  throw new Error(
    'REDIS_URL must be defined.\nConsider defining it in a supplied .env file.'
  );
}

const redisClient = createClient({ url: REDIS_URL }).on('error', (err) => {
  throw new Error('Failed to connect to Redis server. Error: ', err);
});

export const startDB = async () => {
  if (!redisClient.isReady) {
    await redisClient.connect();
  }
  return redisClient;
};
