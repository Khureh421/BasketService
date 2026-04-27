import amqp from 'amqplib';

export async function publishOrder(order) {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const queue = 'order.created';

    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify(order);

    channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true
    });

    console.log('Order sent:', message);

    setTimeout(() => {
        connection.close();
    }, 500);
}