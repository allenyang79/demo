//GLOBAL EVENT
//ADD_MONSTER
var GameEvent={};
GameEvent.INIT_MAP='init_map';
GameEvent.INIT_MONSTER_COLLECTION='init_monster_collection';
GameEvent.ADD_MONSTER='add_monster';
GameEvent.MONSTER_TOUCH_DOWN='monster_touch_down';//怪物到家
GameEvent.ADD_TOWER='add_tower';
GameEvent.ADD_ATTACK='add_attack';
GameEvent.ATTACK_ON_TARGET="attack_on_target"
var Game=(function(){
	var _Game=Backbone.Model.extend({
	  defaults: {
	  	fps:30,
	    width:500,
	    height:500,
	    cellWidth:30,
	    cellHeight:30,
	    mapData:[
		    [0,0,0,0,0, 1,0,0,0,0 ,0,0,0,0,0, 0,1,1],
				[1,1,0,1,0, 1,0,1,1,1 ,1,1,0,1,1, 0,0,0],
				[0,1,0,1,0, 1,0,0,0,0 ,1,1,0,0,1, 0,1,0],
				[0,0,0,0,0, 1,0,1,1,0 ,1,1,1,1,1, 0,1,0],
				[1,0,0,1,0, 1,0,0,0,0 ,0,1,0,0,0, 1,1,0],
				[1,1,0,1,0, 1,1,1,1,1 ,0,1,0,1,1, 0,0,0],
				[1,1,0,1,0, 0,0,0,0,1 ,0,1,0,1,1, 0,1,1],
				[0,0,0,1,1, 1,1,1,0,0 ,0,1,0,0,0, 0,0,0]
			],
			startPosition:[{
				x:0,
				y:0
			}],
			endPosition:[{
				x:17,
				y:7
			}],
			status:1 //1:play,0:pause
		},
		initialize:function(){
			console.log("[Game]initialize");
			var mapData=_.zip.apply(this,this.get('mapData'));
			this.set('mapData',mapData);
		},
		initGame:function(){
			console.log("[Game]initGame");
			this.initMap();
			this.initMonsterCollection();
			this.initTowerCollection();
			this.initAttackCollection();
			//test
			this.trigger("HELLO_WORLD",this);
		},
		initMap:function(){
			console.log("[Game]initMap");
			var self=this;
			var map=new Map(null);
			this.set('map',map);
			
			map.initMap(this.get('mapData'));
			map.optimizePath();
			
			this.trigger(GameEvent.INIT_MAP,map);
			return map;
		},
		initMonsterCollection:function(){
			console.log("[Game]initMonsterCollection");
			var self=this;
			var monsterCollection=new MonsterCollection;
			this.set('monsterCollection',monsterCollection);
			
			//trigger ADD_MONSTER
			monsterCollection.on('add',function(monster){
				console.log("[Game]on monsterCollection add");
				if(monster){
					self.trigger(GameEvent.ADD_MONSTER,monster);
				}
			},self);
			
			this.trigger(GameEvent.INIT_MONSTER_COLLECTION,monsterCollection);
			return monsterCollection;
		},
		initTowerCollection:function(){
			console.log("[Game]initTowerCollection");
			var self=this;
			var towerCollection=new TowerCollection;
			this.set('towerCollection',towerCollection);
			
			//bind ADD_TOWER
			towerCollection.on('add',function(tower){
				console.log("[Game]on towerCollection add");
				if(tower){
					self.trigger(GameEvent.ADD_TOWER,tower);
				}
			},self);
		},
		initAttackCollection:function(){
			var self=this;
			var attackCollection=new AttackCollection;
			this.set('attackCollection',attackCollection);
			
			attackCollection.on('add',function(attack){
				console.log("[Game]on attackCollection add");
				if(attack){
					self.trigger(GameEvent.ADD_ATTACK,attack);
				}
			},self);
			
		},
		addMonster:function(){
			console.log("[Game]addMonster");	
			var startPosition=this.get('startPosition');
			var p=startPosition[_.random(0,startPosition.length-1)];
			var monster=this.addMonsterByPosition(p.x,p.y);
			return monster;
		},
		addMonsterByCell:function(cell){
			console.log("[Game]addMonsterByCell");
			console.dir(cell);
			var monsterCollection=this.get('monsterCollection');
			if(!monsterCollection){
				throw "monsterCollection is not exists";
			}

			var monster=monsterCollection.add({
				currentCell:cell
			});
		},
		addMonsterByPosition:function(x,y){
			console.log("[Game]addMonsterByPosition");
			var map=this.get('map');
			if(!map){
				throw "map is not exists";
				return;
			}
			var cell=map.getCell(x,y);
			var monster;
			if(cell)
				this.addMonsterByCell(cell);
			else
				throw 'cell is not exist';
		},
		addTowerByCell:function(cell){
			if(!cell.get('tower')){
				console.log("[Game]addTowerByCell");
				var towerCollection=this.get('towerCollection');
				if(cell && towerCollection){
					towerCollection.once('add',function(tower){
						console.log("[Game]connect cell and tower");
						cell.set('tower',tower);
					},this);
					towerCollection.add({
						currentCell:cell
					});
				}
				else
					throw 'cell is not exist';
			}else{
				console.log("[Game]cell has Tower");
			}
		}
	});
	var instance;
	_Game.getInstance=function(){
		if(!instance)
			instance=new _Game;
		return instance;
	};
	return _Game;
}());


var GameView=Backbone.View.extend({
	initialize:function(options){
		console.log("[GameView]initialize");
		this.model.view=this;
		this.stage=options.stage;

		if(!this.container){
			this.container=new createjs.Container;
			this.stage.addChild(this.container);	
		}
		
		/*
		this.model.on('all',function(e){
			console.log("[GameCollection]Event:"+e);
		},this);
		*/
		/*
		var color="#ff0000";
		var g = new createjs.Graphics()
			.beginFill(color)
			.drawRect(30*-0.5,30*-0.5,30,30);
			//drawCircle(0,0,30);
		var sp=new createjs.Shape(g);
		this.container.addChild(sp)
		*/
		//Event Listener
		this.model.once(GameEvent.INIT_MAP,function(map){
			var mapView=new MapView({model:map});
			this.container.addChild(mapView.container);
		},this);
		this.model.once(GameEvent.INIT_MONSTER_COLLECTION,function(){
			//alert("INIT_MONSTER_COLLECTION");
		},this);
		
		this.model.on(GameEvent.ADD_MONSTER,this.doAddMonsterView,this);
		this.model.on(GameEvent.ADD_TOWER,this.doAddTowerView,this);
		this.model.on(GameEvent.ADD_ATTACK,this.doAddAttackView,this);
		
		
		this.tick=function(){
			if(this.model.get('status')==1){
				//console.log("[Game]Tick");
				this.stage.update();
				
				//tick everying
				//console.dir(this.model);
				/*
				this.model.get('towerCollection').each(function(tower){
				});
				*/
			}else{
				//pass
			}
		}.bind(this);
		this.play();
	},
	play:function(){
		this.model.set('status',1);
    createjs.Ticker.setFPS(this.model.get('fps'));
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener('tick',this.tick);
	},
	stop:function(){
    createjs.Ticker.removeEventListener('tick',this.tick);		
		this.model.set('status',0);
	},
	doAddMonsterView:function(monster){
		console.log("[GameView]doAddMonsterView");
		var monsterView=new MonsterView({
			model:monster
		});
		this.container.addChild(monsterView.container);
	},
	doAddTowerView:function(tower){
		var towerView=new TowerView({
			model:tower
		});
		
		console.log("[GameView]doAddTowerView");
		console.dir(towerView.container);
		this.container.addChild(towerView.container);
	},
	doAddAttackView:function(attack){
		console.log("[GameView]doAddAttackView");
		var attackView=new AttackView({
			model:attack,
		});
		this.container.addChild(attackView.container);		
	}
});

