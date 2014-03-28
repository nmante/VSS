'use strict';

app.service('webAudio', ['$window', '$http', function($window, $http){
	/*
	 *	Using the $window service, let's get a reference to
	 *	the correct 'AudioContext' (from chrome, or firefox, etc.)
	 * 
	 */
	$window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.context = new AudioContext();


	/* PUBLIC variables */

	// The position of the sound we're going to play
	this.position = {};

	// The frequency of the sinusoidal tone we'll play
	this.frequency = 220; //freq in Hz

	if (DEBUG) {
		console.log("Frequency in Service: " + this.frequency);
	}

	// When to start the sound
	this.playTime = -1;

	// Two properties which relate to the rise and decay of the sound
	this.attackTime = .1;
	this.releaseTime = .1;

	// We'll put our mp3 sound file (buffer array) into this variable
	this.soundBuffer = null;

	// This service will play a sinusoid tone, OR an mp3 file. This variable
	// gives us the choice between the two.  'true' for the mp3, 'false'
	// for the sinusoid
	this.shouldUseSoundBuffer = false;

	this.isPlaying = false;


	/* PRIVATE/local variables */

	// AudioNode: This will 'pan' or move the sound from left to right ear
	var panner;

	// AudioNode: Will be the source node for sinusoidal tones
	var	oscillator; 

	// AudioNode: This node controls the volume, as well as the rise and decay
	// of the sound
	var	gain; 

	// AudioNode: This node will be node which encapsulates the sound file
	var	bufferSource; 

	// Dictionary/Object to hold properties for the sine wave and its sound
	// envelope.  Pass these to the classes below
	var oscillatorParams = {
		frequency : this.frequency
	}
	var envelopeParams = {
		attackTime : this.attackTime,
		releaseTime : this.releaseTime
	}
	
	
	// PRIVATE CLASS: This class encapsulates the Web Audio Oscillator node
	var Oscillator = (function(context){
		function Oscillator(){
			this.oscillator = context.createOscillator();
			this.type = this.oscillator.type = this.oscillator.SINE; //sine wave
			this.freqValue = this.oscillator.frequency.value = oscillatorParams.frequency;
		}
		
		Oscillator.prototype.connect = function (node){
			this.oscillator.connect(node);
		}
		
		return Oscillator;
	}(this.context, oscillatorParams));

	// PRIVATE CLASS: This class encapsulates the Web Audio panner node
	var Panner = (function(context){
		function Panner(){
			this.panner = context.createPanner();
			//-this.coneOuterGain = this.panner.coneOuterGain = 0.1;
			//this.coneOuterAngle = this.panner.coneOuterAngle = 180;
			//this.coneInnerAngle = this.panner.coneInnerAngle = 0;
			this.panningModel = this.panner.panningModel = "HRTF";
		};

		Panner.prototype.setPosition = function(xPosition, yPosition, zPosition) {
			this.panner.setPosition(xPosition, yPosition, zPosition);
		};

		Panner.prototype.connect = function(node) {
			this.panner.connect(node);
		};
		
		return Panner;
		
	}(this.context));


	// PRIVATE CLASS: This class encapsulates the Web Audio gain node
	var Gain = (function(context){
		function Gain (){
			this.gain = context.createGain();
			//this.setValueAtTime = this.gain.gain.setValueAtTime;
			//this.linearRampToValueAtTime = this.gain.gain.linearRampToValueAtTime;	
		};
		
		Gain.prototype.connect = function(node) {
			this.gain.connect(node);
		};

		return Gain;

	}(this.context));

	// PUBLIC method: This function asynchronously loads a sound file at a 
	// given URL. We make this public so our controllers can load files
	this.loadSoundBuffer = function (soundUrl, _this){

		delete $http.defaults.headers.common['X-Requested-With'];

		// Create an http request to get the sound file as an 'arrayBuffer'
		// If the request is successful, decode the 'arraybuffer' and put it 
		// into the 'this.soundBuffer' variable
		// Otherwise throw an error
		$http({
			method: 'GET',
			url: soundUrl,
			responseType: "arraybuffer"
		})
		.success(function(data, status, headers, config){
			// callback will be called asychronously
			// when response is available
			_this.context.decodeAudioData(data, function (buf) {
				_this.soundBuffer = buf;
				if (DEBUG) {
					console.log(_this.soundBuffer);
					console.log(_this);
				}
			}, function(error){
				console.log("Error occured loading audiobuffer");
			});
			
			if (DEBUG) {
				console.log(status + " OK: Successfully loaded sound buffer.");
			}
			_this.shouldUseSoundBuffer = true;

		})
		.error(function(data, status, headers, config){
			// called asynchronously if error occurs
			// or if server returns error status response
			console.log(status + " FAIL: Did not correctly load sound buffer.");

		});
	};


	// PUBLIC method: This function plays the buffer or sinusoid.  It uses the 
	// 'this.position' object to generate a sound at a specific position
	// We create new oscillator/bufferSource, panner and gain nodes everytime
	// because the Web audio api requires that methodology
	this.play = function () {	
	 	
	 	if (DEBUG) {
	 		console.log(this.frequency);
	 		console.log(this.shouldUseSoundBuffer);
	 	}

	 	// Use this variable to tell oscillator/bufferSource when to start
	 	// start playing. It changes to the current time upon each call of 
	 	// this function 'this.play'	
		this.playTime = this.context.currentTime;

		// The custom panner class. Responsible for moving the sound from left
		// to right ear
 		panner = new Panner();

 		// The custom gain class. Adjusts the volume
		gain = new Gain();
	
		// Grab the x and y position from the json object
		var xPos = this.position.xpos; //object x-position in pixels
		var yPos = this.position.ypos; //object y-position in pixels

		if (DEBUG) {
			console.log("Pixel Position-x: " + xPos + " Position-y: " + yPos);
		}

		// Scale the x and y position (pixel values) to unit scale
		// The position from json will be in pixels (i.e 330 x 210)
		// We need to convert these positions to values within (-1 to 1)
		// Do this based on the width and height of the camera

		var cameraHeight = this.position.cameraHeight;
		var cameraWidth = this.position.cameraWidth;
		var pannerPosX = xPos/(cameraWidth/2) - 1;
		var pannerPosY = 1 - yPos/(cameraHeight/2);

		if (DEBUG) {
			console.log("Panner Position-x: " + pannerPosX + " Position-y: " + pannerPosY);
		}	

		// Set the position on the panner variable 
		panner.setPosition(pannerPosX, pannerPosY, .5);

		// Change the volume of the sound linearly, to get rid of 
		// abrupt clicking in between sounds
		gain.gain.gain.setValueAtTime(0, this.playTime);
		gain.gain.gain.linearRampToValueAtTime(.5, this.playTime + this.attackTime);
		gain.gain.gain.linearRampToValueAtTime(0, this.playTime + this.attackTime + this.releaseTime);


		// Check to see if we're playing sinusoidal tones or buffers
		if(!this.shouldUseSoundBuffer){
			// Generate a sinusoidal tone
			console.log("Using sinusoid");
			oscillator = new Oscillator();
			oscillator.connect(panner.panner);
			panner.connect(gain.gain);
			gain.connect(this.context.destination);

			// Play it for .4 seconds
			oscillator.oscillator.start(this.playTime, 0, 0);
			oscillator.oscillator.stop(this.playTime + .4);

		}else{
			console.log("Using buffer");
			// Create the mp3 sound, and load it into a node
			bufferSource = this.context.createBufferSource();
			console.log(this.soundBuffer);
			bufferSource.buffer = this.soundBuffer;	
			bufferSource.connect(panner.panner);	
			panner.connect(this.context.destination);

			// Play it for 5 seconds
			bufferSource.start(this.playTime, 0, 0);
			bufferSource.stop(this.playTime + 5);
		}
		
	};

	// Call this when stopping. Note, this doesn't actually stop the sound
	// Simply here to give us a print statment when the program is done running
	this.stop = function () {
		console.log("Stopping");
		this.isPlaying = false;
	};
}]);
