# Virtual Sound Source

Nii Mante
February 20th, 2014

## tl;dr
- Express (Node.js) Webserver
- Socket.io for realtime transfer 
- Angular JS frontend code

Express receives POST requests -> socket.io emits data -> AngularJS takes data and plays 3D audio via Web Audio API (no User Interface)

## Installation

Make sure you have [node](http://nodejs.org/download/) installed.

Clone the repo:

	git clone https://github.com/nmante/VSS.git

Change into the directory you've put the git repo in (probably VSS/), and install the node packages:
	
	npm install

## Usage

Start the Server:

	npm start

Open your web browser to localhost on port 3000:

	http://127.0.0.1:3000

Now to test, you need to make HTTP POST requests to

	http://127.0.0.1:3000/position

With this format:

	{
		"xpos": 81.5,
		"ypos": 393,
		"cameraWidth": 640,
		"cameraHeight":480
	}

***Note***
These are constraints for the above key value pairs:

	0 < xpos < 640

	0 < ypos < 480

	cameraWidth = 640

	cameraHeight = 480

You're pretty much sending a 2D (x,y) coordinate, as well as a normalization
factor (cameraWidth and cameraHeight) so that the Express Server can reduce
xpos and ypos to numbers between -1 and 1.

TODO - Add a test directory with json files, and create a bash script which
sends curl requests for each json file

## Purpose

The purpose of this code is to act as a Express Webserver that relays positional information to client side AngularJS/Web Audio API code.

A c++ client will POST json to the server via HTTP.  Then, a Javascript web client will GET the json from the server and use it for processing.  The processing done will include playing positional audio via the Web Audio API.

## Structure

#### Server Side - Node.js + Express + Socket.io

I'm using [Node.js](www.nodejs.org) to act as a simple webserver.  Furthermore, the [Express](http://expressjs.com/) web framework is sitting on top of Node to give me easy manipulation of routes, request handling and response generation.

I'm communicating with the Angular JS client via [socket.io](http://socket.io/).

#### Client Side - Web Audio API/Javascript

The web client will be implemented in HTML/JavaScript.  It's job will be to fetch json via AJAX calls. From there, I'll use the Web Audio API to play tones/sounds which correspond to the information fetched.

## What's Positional Audio (BRIEF Description)

As humans, we are able to localize a sound based on where it's coming from. If you were to close your eyes and listen for a sound coming from somewhere in your environment, you would be able to detect which direction that sound came from. It's the same reason why when you hear a loud noise, you turn your head towards that noise. We call this ability, Sound Localization.

Thus, we can "reverse engineer" this notion of humans being able to localize sounds, by utilizing mathematical equations called HRTF's (Head Related Transfer Funtions). This gives us the ability to reproduce/synthesize sounds by mimicking the time and phase delay of a sinusoidal wave.
