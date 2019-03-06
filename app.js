const express = require('express'),
	 app = express(),
	 bodyParser = require('body-parser');
	 PORT = process.env.PORT || 5000;



//additional middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',require('./routes/routes'));

app.listen(PORT,console.log(`Server started listening on port ${PORT}`));





