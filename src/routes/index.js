const express = require('express');
const router = express.Router();
const amqp = require('amqplib/callback_api');
const ramda = require('ramda');

router.get('/send/:message', (req, res, next) => {
  try {
    const messageData = ramda.pathOr('empty', ['params', 'message'], req);

    amqp.connect('amqp://localhost:5672', (err, conn) => {
      if (err) throw err;

      conn.createChannel((err, ch) => {
        if (err) throw err;
        
        const keys = ['001', '002'];
        const replyTo = keys[Math.floor(Math.random() * keys.length)];

        ch.assertExchange('room.notification', 'fanout', { durable: true });
        ch.publish(
          'room.notification',
          '',
          Buffer.from(messageData),
          { headers: { replyTo },
        });

        res.json({
          sended: true,
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;