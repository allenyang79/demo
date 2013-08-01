console.log("main.js");
//require(dependencies, callback,factory);
//define
require({
	shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  },
	paths:{
	  jquery:'//ajax.googleapis.com/ajax/libs/jquery/1.10.0/jquery.min',
		underscore:'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		backbone:'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		bootstrap:'//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min',
		createjs:'http://code.createjs.com/createjs-2013.05.14.min',
		gsap:'//cdnjs.cloudflare.com/ajax/libs/gsap/1.9.7/TweenMax.min',
	},
	priority:['jquery','underscore','backbone'],
	urlArgs: "r=" + (new Date()).getTime()
},['jquery','underscore','backbone','app'],
function(){
}); 
