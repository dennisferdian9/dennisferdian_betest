import { config } from "dotenv";
import * as redis from "redis"

config()

export const redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${ process.env.REDIS_PORT ?? 6379}`
    });

redisClient.on("error", function(error) {
  console.error(error);
});

(async () => {
      await redisClient.connect();
      console.log('Connected to Redis');
    })();