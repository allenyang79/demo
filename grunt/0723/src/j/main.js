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

define(['jquery','aa','cc'],function(){
	console.log("main start");

});
