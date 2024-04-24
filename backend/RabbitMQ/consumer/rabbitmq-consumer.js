import { connection, channel, rabbitmqConfig, connectToRabbitMQ } from '../rabbitmq_connect.js';

// Consumer function to process messages
async function consumeMessages() {
    try {
      await connectToRabbitMQ(); // Ensure connection and channel are ready
  
      channel.consume(rabbitmqConfig.queueName, async (msg) => {
        if (msg) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log('Received message:', messageContent);
  
          // Process the message here
          // Placeholder: Perform tasks like processing an order
  
          // Acknowledge after processing
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error consuming messages:', error);
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

// Start consuming messages when the script is run
await consumeMessages();