const amqp = require('amqplib/callback_api');

function start() {
  amqp.connect('amqp://localhost:5672', (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, ch) => {
      if (err) throw err;

      ch.consume('room-final-response', (message) => {
        const data = JSON.parse(message.content.toString());
        console.log(
          `consumer-final-response: receive from "${data.id}" = "${data.extra.valid}"`,
        );
      }, { noAck: true });
    });
  });
}

module.exports = start;

