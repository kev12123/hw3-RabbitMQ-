const express = require('express'),
	router = express.Router(),
	amqp = require('amqplib/callback_api');


router.post('/listen',(req,res)=>{

	//bind keys received to direct exchange HW3 { keys: [array] }

	var keys = req.body.keys;
	console.log(keys);
	var exchange = "HW3";

		amqp.connect('amqp://test:test@130.245.170.206:5672/',(err,conn)=>{

			conn.createChannel((err,ch)=>{

				ch.assertExchange(exchange,'direct',{durable: true});

				ch.assertQueue('', {exclusive: true} , (err,q)=>{

					console.log("Listening");

					keys.forEach(function(key){

						ch.bindQueue(q.queue,exchange,key);
					});

					ch.consume(q.queue, function(msg){

						console.log(" [x] %s: %s`",msg.fields.routingKey, msg.content.toString());
					},{noAck: true});
				});
			});
		   
		});
});


router.post('/speak',(req,res)=>{

	//publish message to exchange HW3 with key provided { key:, msg: }
    var exchange = "HW3";
	var {key,msg} = req.body;

	amqp.connect('amqp://test:test@130.245.170.206:5672/',(err,conn)=>{

		conn.createChannel((err,ch)=>{

			ch.assertExchange(exchange,'direct',{durable: true});

			ch.publish(exchange,key,Buffer.from(msg));

			console.log(" [X] Sent %s: '%s'",key,msg);

		});
	});


});

module.exports = router;