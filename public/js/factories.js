'use strict';
app.factory('socket', function($rootScope){
	// var socket = io.connect("http://localhost:3000");
	var socket = io.connect("http://" + $rootScope.host + ":" + $rootScope.port);
	return {
		on: function  (eventName, callback) {
			socket.on(eventName, function  () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function  (eventName, data, callback) {
			socket.emit(eventName, data, function  () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
				
			});
		}


	};
});
