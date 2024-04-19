import { createClient } from 'redis';

// Parse the Redis URL
const redisUrl = new URL(process.env.REDIS_URL || 'redis://localhost:6379');

// Extract the host and port from the parsed URL
const redisHost = redisUrl.hostname;
const redisPort = parseInt(redisUrl.port);

console.log('Redis URL:', redisHost, redisPort);

// Create the Redis client with the specified host and port
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

console.log('Connecting to Redis server', redisHost, redisPort);

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

console.log('Connected to Redis server');


// Function to set request with its corresponding response in the Redis cache
async function cacheRequest(req, responseData) {
    try {
        // Serialize the request data (e.g., URL, query parameters, headers) and response data
        const cacheKey = JSON.stringify({ url: req.url, params: req.params, query: req.query, body: req.body });
        const cacheValue = JSON.stringify(responseData);

        // Cache the request and response data in Redis
        await redisClient.set(cacheKey, cacheValue); 

        await redisClient.expire(cacheKey, 30); // Set an expiry time for the cache (e.g., 30 seconds)

        console.log('Request and response cached:', cacheKey);
        
    } catch (error) {
        console.error('Error caching request and response:', error);
        throw error;
    }
}

// Middleware function for checking cached responses
async function cacheMiddleware(req, res, next) {
    try {
        // Check if the request method is GET
        if (req.method === 'GET') {
            // Serialize the request data to generate the cache key
            const cacheKey = JSON.stringify({ url: req.url, params: req.params, query: req.query, body: req.body });

            // Check if data exists in Redis cache
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                console.log('Data found in cache');

                // Parse the cached response data and send it
                const responseData = JSON.parse(cachedData);
                res.json(responseData);
            } else {
                // If data not found in cache, move to the next middleware
                next();
            }
        }
    } catch (error) {
        console.error('Error in cacheMiddleware:', error);
        next(error);
    }
}


export { cacheRequest, cacheMiddleware };