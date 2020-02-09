const amqp = require('amqplib/callback_api');

function start() {
  amqp.connect('amqp://localhost:5672', (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, ch) => {
      if (err) throw err;

      ch.consume('room-two', (message) => {
        if (message.properties.headers.replyTo === '002') {
          console.log(`\n${message.properties.headers.replyTo}`);
          console.log('consumer-two: receive', message.content.toString());
          ch.assertQueue('room-final-response', { durable: true });
          ch.sendToQueue('room-final-response', Buffer.from(
            JSON.stringify(
              {
                id: 'room-two',
                extra: {
                  valid: false,
                },
              },
            ),
          ));
        }
      }, { noAck: true });
    });
  });
}

module.exports = start;

