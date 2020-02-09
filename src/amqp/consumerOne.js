const amqp = require('amqplib/callback_api');

function start() {
  amqp.connect('amqp://localhost:5672', (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, ch) => {
      if (err) throw err;

      ch.consume('room-one', (message) => {
        if (message.properties.headers.replyTo === '001') {
          console.log(`\n${message.properties.headers.replyTo}`);
          console.log('consumer-one: receive', message.content.toString());
          ch.assertQueue('room-final-response', { durable: true });
          ch.sendToQueue('room-final-response', Buffer.from(
            JSON.stringify(
              {
                id: 'room-one',
                extra: {
                  valid: true,
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
