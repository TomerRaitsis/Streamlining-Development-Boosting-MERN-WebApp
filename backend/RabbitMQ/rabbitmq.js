import amqp from 'amqplib';

const rabbitmqConfig = {
    //hostname: 'localhost', 
    port: process.env.RABBITMQ_PORT || 5672, 
    username: process.env.RABBITMQ_USERNAME || 'guest', 
    password: process.env.RABBITMQ_PASSWORD || 'guest', 
    vhost: '/',
    queue_name: process.env.RABBITMQ_QUEUE_NAME || 'test_queue'
};

let connection;

async function connectToRabbitMQ() {
    console.log('Connecting to RabbitMQ');
    console.log(`amqp://${rabbitmqConfig.username}:${rabbitmqConfig.password}@rabbitmq:${rabbitmqConfig.port}`);
    try {
        connection = await amqp.connect(`amqp://${rabbitmqConfig.username}:${rabbitmqConfig.password}@rabbitmq:${rabbitmqConfig.port}`);
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
        process.exit(1);
    }
}

async function setupChannel() {
    try {
        const channel = await connection.createChannel();
        await channel.assertQueue(rabbitmqConfig.queue_name);
        console.log('Channel and queue setup complete');
    } catch (error) {
        console.error('Error setting up channel and queue:', error.message);
    }
}

async function publishMessage(message) {
    try {
        const channel = await connection.createChannel();
        await channel.sendToQueue(rabbitmqConfig.queue_name, Buffer.from(JSON.stringify(message)));
        console.log('Message published:', message);
    } catch (error) {
        console.error('Error publishing message:', error.message);
    }
}

async function consumeMessages() {
    try {
        const channel = await connection.createChannel();

        // Fetch one message from the queue
        const message = await channel.get(rabbitmqConfig.queue_name);

        if (message !== false) {
            console.log('Received message:', message.content.toString());

            // Process the message here


            // Acknowledge the message after processing
            channel.ack(message);
        } else {
            console.log('No message available in the queue');
        }

        console.log('Listening for messages...');
    } catch (error) {
        console.error('Error consuming messages:', error.message);
    }
}


process.on('SIGINT', async () => {
    try {
        await connection.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing connection:', error.message);
        process.exit(1);
    }
});

export {
    connectToRabbitMQ,
    setupChannel,
    publishMessage,
    consumeMessages
};
