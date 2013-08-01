
define('aa',['jquery'],function(){
	console.log("aa.js");
});

define('bb',['jquery'],function(){
	console.log("bb.js");
});

define('cc',['jquery','bb'],function(){
	console.log("cc.js");
});

require.config({
	baseUrl:'./',
	paths: {
		//'jquery':'jquery-1.10.2.min',
		'jquery':'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'
	},
	shim: {
	},
	preserveLicenseComments:false
});

define('main',['jquery','aa','cc'],function(){
	console.log("main start");

});
