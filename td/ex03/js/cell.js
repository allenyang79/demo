define(['createjs'],function () {
	var Cell;
	Cell=_.extend(createjs.Container,{	
	});
	
	Cell.prototype.constructor=function(x,y,type){
		createjs.Container.apply(this,arguments);
		/*
		var color="#ff0000";
		var g = new createjs.Graphics()
		.beginFill(color)
		.drawRect(30*-0.5,30*-0.5,30,30);
		//drawCircle(0,0,30);
		var shape=new createjs.Shape(g);
		this.addChild(shape);
		*/
	}
	console.dir(Cell);
	return Cell;
});