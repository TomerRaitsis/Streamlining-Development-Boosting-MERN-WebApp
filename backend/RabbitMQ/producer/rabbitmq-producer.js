import { connection, channel, rabbitmqConfig, connectToRabbitMQ } from '../rabbitmq_connect.js';

// Function to add a message to the queue
async function addToQueue(message) {
    try {
        console.log('Adding message to queue:', message);
        await connectToRabbitMQ(); // Ensure the connection and channel are set up

        // Publish the message to the specified queue
        await channel.sendToQueue(
            rabbitmqConfig.queueName,
            Buffer.from(JSON.stringify(message)),
            { persistent: true } // Persistent messages ensure durability
        );

        console.log('Message added to queue:', message);
    } catch (error) {
        console.error('Error adding message to queue:', error);
        throw error; 
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    if (connection) {
        try {
            await connection.close();
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }
    process.exit(0);
});

export { addToQueue };
