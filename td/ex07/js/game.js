console.log("load game.js");

define(['app','map'],function(App,Map){		
	var Game;	
	var GameModel=Backbone.Model.extend({
		initialize:function(){
			console.log("[Game]init");
	
			//game description
			//map is a Collection
			//cell is a model, and cell has a veiw can be click
			//there are a Collection of Monster
			//and there are a Collection of Tower
			//and Tower can create a attack on Monster 
			//so attack as a Object,contain  a Tower and a Monster
			
			//else component start flag,stop flag
			//parse config			
			//this.map=new Map;
			//this.addChild(this.map);
		}
	});	
	
	Game=(function(){
		function createGame(options){
			console.log("[Game]Create GameController Model and View");
			var model=new GameModel;
			var view=new createjs.Container;
			
			
			return {
				model:model,
				view:view,
				init:function(){
					//build Map
					var config=App.getInstance().get('config');
					var mapData=config.MAP;
					mapData=_.zip.apply(this,mapData);
					//console.dir(mapData);
					
					var map=Map.createMap(mapData);
					map.model.initMap(mapData);
					
					this.view.addChild(map.view);
				},
			}
		}
		//end _createGame
		//game View
		return {
			createGame:createGame	
		}
	}());
	
	App.Game=Game;
	return Game;
});
