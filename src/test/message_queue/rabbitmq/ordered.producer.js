"use strict";
const amqp = require("amqplib");

async function consumerOrderedMes() {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const queueName = "ordered-queue";
    await channel.assertQueue(queueName, { durable: true });
    for (let index = 0; index < 10; index++) {
      const mes = "queue at index::" + index;
      // send mes
      channel.sendToQueue(queueName, Buffer.from(mes), {
        persistent: true,
      });
    }
    setTimeout(() => {
      connection.close();
    }, 5000);
  } catch (error) {
    console.log(error);
  }
}

consumerOrderedMes().then().catch();
