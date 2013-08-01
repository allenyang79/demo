console.log("load app.js");
define(function (){
	
	var instance;
	var App=(function(){
		function AppInit(){
		
			return {
				init:function(){
					console.log("[App]init");

					if(!this.stage)
						this.stage=new createjs.Stage("canvas");

					var game=Game.getInstance();
					var gameView=new GameView({	
						model:game,
						stage:this.stage
					});
					
					game.initGame();
					/*
					//var mapData=game.get('mapData');
					var map=game.createMap();
					var mapView=new MapView({model:map});
					gameView.container.addChild(mapView.container);
					*/
					
					//==================
					//gameView.render();
					//gameView.play();
					//====================

				}
			};
		};
		return {
			getInstance:function(){
				if(!instance)
					instance=AppInit();
				return instance
			}
		}
	}());
	return App;
});
