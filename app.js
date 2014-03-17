/*
 * Nii Mante
 *
 * Node.js + Express Webserver
 * Purpose
 * 	Receive HTTP requests from C++ client.
 * 	Emit data to Angular.js client via Socket.io
 *
 */


//Wrap our server into self executing anonymous function
(function(){
	//Get the express module
	var express = require('express');
	
	//Execute the express module, store it and create our server
	var app = express();
	var port = 3000;
	var server = app.listen(port);

	//Create our socket.io listener
	var io = require('socket.io').listen(server);
	
	app.set('port', process.env.PORT || port); 
	app.use(express.favicon());
	
	//Tell express to serve our documents (html, angular, css)
	//from the 'public' directory 
	app.use(express.static(__dirname + '/public'));
	
	//Must put express.bodyParser() before router
	//bodyParser() lets us put json request body into the 'request'
	//body property ('request' referring to the Express 'request' object)
	app.use(express.bodyParser());
	app.use(app.router);	


	//Configure our actions for different verbs
	
	//client POST's to /cameraParameters. send the data to all clients
	//(i.e. the angular app)
	app.post('/cameraParameters', function (req, res) {
		io.sockets.emit('cameraParameters', req.body);
	});	
	
	//Received object position via POST. Send it along to angular
	app.post('/position', function (req, res) {
		io.sockets.emit('position', req.body);
	});

	//Received kill signal via POST from C++ client. Send it to angular
	app.post('/stop', function (req, res) {
		io.sockets.emit('stop', req.body);
	});

	console.log("Server running at http://127.0.0.1:"+port);

}())
