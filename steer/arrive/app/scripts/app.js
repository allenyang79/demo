/*global define */
define(['createjs','toxi','underscore','seekarrow'], function () {
  'use strict';
	
	console.log('createjs start');

	$('#canvas').bind('contextmenu', function(e){
    return false;
	});
	var SeekArrow=_.last(arguments);
	
	var stage=new createjs.Stage('canvas');	
	var stageWidth=stage.canvas.clientWidth;
	var stageHeight=stage.canvas.clientHeight;

	var mouseSp=new createjs.Shape();
	mouseSp.graphics
    .beginFill(createjs.Graphics.getRGB(0xff0000,0.5))
    .drawCircle(0,0,5);
	stage.addChild(mouseSp);

	var arrowCollection=[];
		
	createjs.Ticker.useRAF=true;
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick',loop);
	function loop(){
	  stage.update();    
		mouseSp.x=stage.mouseX;
		mouseSp.y=stage.mouseY;
		_.each(arrowCollection,function(arrow){
			arrow.aim(stage.mouseX,stage.mouseY);
			arrow.tick();
			//console.dir(arrow);
		});
	}
	//== ouse down================================================================================================
	stage.addEventListener('stagemousedown',function(e){  
		var arrow=new SeekArrow();
		arrow.x=stage.mouseX;
		arrow.y=stage.mouseY;
		stage.addChild(arrow);
		arrowCollection.push(arrow);
	},this);

});
