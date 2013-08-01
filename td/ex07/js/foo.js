console.log("load game.js");
define(['app'],function(App){		
	//extend App
	App.foo=function(){
		console.log("[App]foo");
	}
	//console.log(typeof App.foo);
});