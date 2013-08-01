define(['underscore','createjs','ui'],function () {
	var Scene=function(){
		createjs.Container.apply(this,arguments);
	};
	Scene.prototype=createjs.Container;
	Scene.prototype.constructor=function(){
		
	}
	Scene.prototype.foo=function(){
		console.dir("foo");
	}
	Scene.prototype.foo=function(){
		console.dir("bar");
	}
	return Scene;
});

