'use strict';

/*
 * Nii mante
 * Virtual Sound Source app
 * 
 * This app generates 3 dimensional sounds based on (x,y) position
 * provided to it.
 *  
 * App Flow
 * ========
 * 
 * Controller tells Socket.io service grabs position from Node
 * Controller passes position to Web Audio service
 * Controller tells Web Audio Service to play sound
 * 		Sound can be an mp3
 *		Or Sinusoidal tone
 */


var app = angular.module("vssApp",[]);

// Set to true for console print statements, false to turn off 
var DEBUG = true;

