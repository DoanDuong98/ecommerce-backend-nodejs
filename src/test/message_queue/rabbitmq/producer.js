const amqp = require("amqplib");

const messages = 'Hello RMQ';

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, { durable: true });

        // send mes
        channel.sendToQueue(queueName, Buffer.from(messages));
    } catch (error) {
        console.log(error);
    }
}

runProducer().then().catch()
