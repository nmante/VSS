'use strict';

// TODO - Create custom directives to allow you to adjust parameters like
// 		- Frequency
// 		- Attack, Sustain, Delay, Release

app.directive('frequencySlider', [function(){
	
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '<input type="number" ng-model="frequency" min="220" max="1760" step="220" value="220"/>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.log($scope);	
			
		}
	};
}]);

// TODO - Create a directive which let's the user pick the sound to play
//      - Sounds could be sinusoid or songs, or mp3

app.directive('source', [function(){
	return {

	};
}]);