const amqp = require("amqplib");

const messages = "Hello RMQ";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const notiExchange = "notiExchange"; // direct
    const notiQueue = "notiQueueProcess"; // assert queue
    const notiExchangeDLX = "notiExchangeDLX"; // direct
    const notiRoutingKeyDLX = "notiRoutingKeyDLX";

    // 1. create exchange
    await channel.assertExchange(notiExchange, "direct", {
      durable: true,
    });

    // 2. create queue
    const queueRes = await channel.assertExchange(notiQueue, {
      exclusive: false, // cho phep cacs ket noi truy cap vao cung 1 luc hang doi
      deadLetterExchange: notiExchangeDLX,
      deadLetterRoutingKey: notiRoutingKeyDLX,
    });

    // 3.
    await channel.bindQueue(queueRes.queue, notiExchange);

    // send mes
    const mes = "A";
    channel.sendToQueue(queueRes.queue, Buffer.from(mes), {
      expiration: "10000",
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

runProducer().then().catch();
