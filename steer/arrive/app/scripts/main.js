require.config({
	baseUrl:'./scripts',
	paths: {
		jquery: '/../bower_components/jquery/jquery',
		bootstrap: 'vendor/bootstrap',
		createjs: 'vendor/createjs-2013.05.14.min',
		underscore: '/../bower_components/underscore/underscore-min',
		backbone: '/../bower_components/backbone/backbone-min',
		toxi:'/../bower_components/toxiclibsjs/build/toxiclibs.min',
		paper: '/../bower_components/paper/dist/paper-full.min',
	},
	shim: {
		bootstrap: {
		  deps: ['jquery'],
		  exports: 'jquery'
		},
		createjs:{
		  exports:'createjs'
		},
		toxi:{
		  exports:'toxi'
		},
		backbone:{
			deps:['underscore']
		}
	}
});
require(['jquery','underscore','bootstrap','createjs'], function (app, $) {
	
});
