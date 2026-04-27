import amqp from "amqplib";

async function startConsumer() {
    let connection;

    while (!connection) {
        try {
            connection = await amqp.connect(process.env.RABBITMQ_URL);
            console.log("Connected to RabbitMQ");
        } catch (err) {
            console.log("RabbitMQ not ready, retrying in 3s...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    const channel = await connection.createChannel();
    const queue = "order.created";

    await channel.assertQueue(queue);

    console.log("Listening for messages...");

    channel.consume(queue, (message) => {
        const data = JSON.parse(message.content.toString());
        console.log("Message Received:", data);
        channel.ack(message);
    });
}

startConsumer();