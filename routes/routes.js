const express = require('express'),
	router = express.Router(),
	amqp = require('amqplib/callback_api');


router.post('/listen',(req,res)=>{

	//bind keys received to direct exchange HW3 { keys: [array] }

	var keys = req.body.keys;
	console.log(keys);
	var exchange = "HW3";
	var resps = {"listen": []};

		amqp.connect('amqp://test:test@130.245.170.206:5672/',(err,conn)=>{

			conn.createChannel((err,ch)=>{

				ch.assertExchange(exchange,'direct',{durable: false});

				ch.assertQueue('', {exclusive: true} , (err,q)=>{

					console.log("Listening");

					keys.forEach(function(key){

						ch.bindQueue(q.queue,exchange,key);
					});

					ch.consume(q.queue, function(msg){

						console.log(" [x] %s: %s`",msg.fields.routingKey, msg.content.toString());
						res.json({msg: msg.content.toString()})
						conn.close();
					},{noAck: true});

				});
			});



		   
		});

	
});


router.post('/speak',(req,res)=>{

	//publish message to exchange HW3 with key provided { key:, msg: }
    var exchange = "HW3";
	var {key,msg} = req.body;
	console.log(key);
	console.log(msg);

	amqp.connect('amqp://test:test@130.245.170.206:5672/',(err,conn)=>{

		conn.createChannel((err,ch)=>{

			ch.assertExchange(exchange,'direct',{durable: false});

			ch.publish(exchange,key,Buffer.from(msg));

			console.log(" [X] Sent %s: '%s'",key,msg);

		});

		setTimeout(function() {conn.close(); res.send({status:"OK"})},500);
	});

	

});

module.exports = router;