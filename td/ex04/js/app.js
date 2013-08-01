define(['createjs','ui','underscore','cell','map','global'],function (arg1,arg2,arg3,Cell,Map){
	var App=function(canvas){
		//init stage
		
		//add EventDispatcher on this
		createjs.EventDispatcher.initialize(App.prototype);
		
		//loop tick
		this.stage=stage=new createjs.Stage(canvas);
		createjs.Ticker.addEventListener("tick",this.tick.bind(this));

	};
	
	App.prototype=_.extend(App,{
		attrs:{
			
		},
		stage:null,
		initMap:function(mapData){
			this.map=new Map(mapData);
			this.stage.addChild(this.map);
		},
		tick:function(){
			this.stage.update();
		},
		set:function(key,value){
			this.attrs[key]=value;
		},
		get:function(key){
			
		}
	});
	
	return App;
});
