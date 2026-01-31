import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class representing a Redis client.
 */
class RedisClient {
  /**
   * Create a Redis client.
   */
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err.message || err}`);
    });
  }

  /**
   * Check if the connection to Redis is alive.
   * @returns {boolean} true if connection is successful, otherwise false.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value stored in Redis for a given key.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} The value stored in Redis.
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  /**
   * Store a value in Redis with an expiration time.
   * @param {string} key - The key to store the value under.
   * @param {string|number} value - The value to store.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    await setAsync(key, duration, value);
  }

  /**
   * Remove the value stored in Redis for a given key.
   * @param {string} key - The key to remove the value for.
   * @returns {Promise<void>}
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;