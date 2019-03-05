const express = require('express'),
	 app = express()
	 amqp = require('amqplib/callback_api')
	 PORT = process.env.PORT || 5000;





//additional middleware


app.use('/',require('./routes/routes'));

app.listen(PORT,console.log(`Server started listening on port ${PORT}`));





