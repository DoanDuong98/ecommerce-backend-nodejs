"use strict";

const amqp = require("amqplib");

async function consumerOrderedMes() {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const queueName = "ordered-queue";
    await channel.assertQueue(queueName, { durable: true });

    // set prefect để đảm bảo các tác vụ chỉ thực hiện 1 lần 1 lúc
    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
      setTimeout(() => {
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.log(error);
  }
}

consumerOrderedMes().then().catch();
