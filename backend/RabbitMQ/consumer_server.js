import express from 'express';
import  { consumeMessages } from './rabbitmqController.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3001;

console.log('Starting consumer server...' ,process.env.RABBITMQ_USER);


app.listen(port, async () => {
    console.log(`Consumer server listening on port ${port}`);

    try {
        consumeMessages(); // Start consuming messages
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
});
