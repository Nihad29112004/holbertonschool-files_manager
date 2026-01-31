import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * RedisClient class for managing Redis operations.
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err.message || err}`);
    });
  }

  /**
   * Checks if the connection to Redis is alive.
   * @returns {boolean} true if alive, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Gets the value of a key from Redis.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>} The value associated with the key.
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  /**
   * Sets a key-value pair in Redis with an expiration.
   * @param {string} key - The key to set.
   * @param {string|number} value - The value to store.
   * @param {number} duration - Expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    await setAsync(key, duration, value);
  }

  /**
   * Deletes a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;