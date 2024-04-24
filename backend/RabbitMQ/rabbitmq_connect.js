import amqp from 'amqplib';

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
        console.log('Connected to RabbitMQ!');
    }
    if (!channel) {
        channel = await connection.createChannel();
        await channel.assertQueue(rabbitmqConfig.queueName, { durable: true });
        console.log('Channel and queue setup complete');
    }

}

export { connection, channel, rabbitmqConfig, connectToRabbitMQ };
