import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

const rabbitmqConfig = {
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: process.env.RABBITMQ_PORT || 5672, 
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    vhost: '/',
    queueName: process.env.RABBITMQ_QUEUE_NAME || 'test_queue'
};

let connection;
let channel;

// Function to connect to RabbitMQ and set up the channel
async function connectToRabbitMQ() {
    if (!connection) {
        console.log('Connecting to RabbitMQ...');
        connection = await amqp.connect(`amqp://${rabbitmqConfig.username}:${rabbitmqConfig.password}@${rabbitmqConfig.hostname}:${rabbitmqConfig.port}`, () => {
            console.log('Connected to RabbitMQ!!');
        });
    }
    if (!channel) {
        channel = await connection.createChannel();
        await channel.assertQueue(rabbitmqConfig.queueName, { durable: false });
        console.log('Channel and queue setup complete');
    }

}

// Function to add a message to the queue
async function addToQueue(message) {
    try {
        await connectToRabbitMQ(); // Ensure the connection and channel are set up
        console.log('Adding message to queue:', message);

        // Publish the message to the specified queue
        await channel.sendToQueue(
            rabbitmqConfig.queueName,
            Buffer.from(JSON.stringify(message)),
            { persistent: true } // Persistent messages ensure durability
        );

        console.log('Message added to queue!');
    } catch (error) {
        console.error('Error adding message to queue:', error);
        throw error; 
    }
}

// Consumer function to process messages
async function consumeMessages() {
    try {
      await connectToRabbitMQ(); // Ensure connection and channel are ready
      console.log('Consuming messages...');

      channel.consume(rabbitmqConfig.queueName, async (msg) => {
        if (msg) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log('Received message:', messageContent);
  
          // Process the message here
          // Placeholder: Perform tasks like processing an order

          //wait for 20 seconds
            await new Promise((resolve) => setTimeout(resolve, 20000));
            console.log('Order processed:', messageContent);

  
          // Acknowledge after processing
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error consuming messages:', error);
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

export { addToQueue, consumeMessages };
