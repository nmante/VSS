'use strict';

app.controller('MainCtrl', ['$rootScope', '$scope', 'socket', 'webAudio', function ($rootScope, $scope, socket, webAudio){

		// The web address we'll run the server at
		$rootScope.host = "localhost";
		$rootScope.port = 3000;

		// The position of the sound we should play.
		// It's fetched via socket.io from our client
		$rootScope.position = {};

		// The frequency we should play the sinusoid tone at
		$rootScope.frequency = 0;

		// Tell our web audio service to load a file
		webAudio.loadSoundBuffer('res/sounds/audiocheck.net_E3.mp3', webAudio);

		socket.on('connect', function () {
			$rootScope.connectionStatus = "Connected";
		});

		// Listen for the 'position' event from any clients
		// Tell the our custom web audio service to start playing
		socket.on('position', function (data) {
			$rootScope.position = data;
			webAudio.position = $rootScope.position;
			webAudio.play();
		});


		// Listen for the 'stop' event.  Tell our custom web audio service to
		// stop playing 
		socket.on('stop', function (data){
			$rootScope.position = data;
			webAudio.position = $rootScope.position;
			webAudio.stop();
		});

		webAudio.frequency = $rootScope.frequency = 440;

}]);
