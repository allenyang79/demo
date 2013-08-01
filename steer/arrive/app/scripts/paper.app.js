/*global define */
define(['paper','toxi','underscore','jquery'], function () {
  'use strict';
  console.log("[paper.app]start");
  
	var canvas = $("#canvas").get(0);

	// Create an empty project and a view for the canvas:
	var p = paper.setup(canvas);

	//console.dir(p);
	//console.dir(paper);
	// Create a Paper.js Path to draw a line into it:
	var path = new paper.Path();
	// Give the stroke a color
	path.strokeColor = 'black';
	var start = new paper.Point(100, 100);
	// Move to start and draw a line from there
	path.moveTo(start);
	// Note that the plus operator on Point objects does not work
	// in JavaScript. Instead, we need to call the add() function:
	path.lineTo(start.add([ 200, -50 ]));
	
	
	var path = new paper.Path.Circle({
		center: paper.view.center,
		radius: 30,
		strokeColor: 'black'
	});

	function onResize(event) {
		// Whenever the window is resized, recenter the path:
		path.position = paper.view.center;
	}
	$(window).resize(function(){
		onResize();
		paper.view.draw();
	});

	// Draw the view now:
	paper.view.draw();
	
});
	