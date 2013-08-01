console.log("load app.js");
define(function (){
	var App=(function(){
		var instance;
		function initInstance(options){
			console.log("[App]initInstance");
			var app={};
			//return a object  or a function
			//public property and method
			
			//private
			var tick=(function(){
				this.stage.update();
			}.bind(app));
			
			app.attrs={};			
			//public

			return _.extend({
				loadConfig:function(url,callback){
					var self=this;	
					url+='?r='+(+new Date());
					/* //preload
					var queue = new createjs.LoadQueue();
					queue.addEventListener("complete", handleComplete);
					queue.loadFile({id:"config", src:url});
					function handleComplete() {
						var conf=queue.getResult("config");
						console.dir(conf);
					}
					*/
					$.getJSON(url,function(conf){
						var config=self.get('config');
						if(!config)
							config={};
						config=_.extend(conf,config);
						self.set('config',config);				
						callback.apply(self,self.get('config'));
					});
		
				},
				set:function(key,value){
					this.attrs[key]=value;
				},
				get:function(key){

					if(this.attrs[key])
						return this.attrs[key];
					else
						return null;
				},
				init:function(){
					console.log("[App]init");					
					//console.dir(this.get('config'));

					this.stage=new createjs.Stage(options.canvas);
					
					var game=this.game=App.Game.createGame();
					this.currntScreen=game;
					this.stage.addChild(game.view);
					
					game.init();
				},
				play:function(){
					createjs.Ticker.addEventListener("tick",tick);
				},
				stop:function(){
					createjs.Ticker.removeEventListener("tick",tick);
				},
				loadMap:function(){
					
				}
			},app);
		}
		return {
			getInstance:function(){
				if(!instance){
					instance=initInstance.apply(this,arguments);
				}
				return instance;
			}
		}
	}());
	return App;
});
