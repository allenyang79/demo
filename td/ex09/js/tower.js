var TowerStatus={
	RELOAD:0,//
	READY:1,//隨時可攻擊
	FIRE:2,//
};

var Tower=Backbone.Model.extend({
	defaults:{
		currentMapCell:null,
		status:TowerStatus.READY,//0:die,1:think,2:walk
		fireTime:100,
		reloadTime:1000,//開方間隔
		power:1,//火力
		radius:70, //範圍
		editting:false//是否正在編輯
	},
	initialize:function(){
		console.log("[Tower]initialize");
		console.dir(this.attributes);
	}
});
var TowerView=Backbone.View.extend({
	initialize:function(){		
		console.log("[TowerView]initialize")
		
		//bind model and view
		this.model.view=this;
		
		this.container=new createjs.Container;
		this.container.x=this.model.get('currentCell').view.container.x;
		this.container.y=this.model.get('currentCell').view.container.y;
		console.log("[TowerView]twoer at "+this.container.x+","+this.container.y);		

		this.area=this._drawArea();
		this.area.visible=false
		this.container.addChild(this.area);		
		
		this.building=this._drawBuilding();
		this.container.addChild(this.building);

		this.model.on('change:editting',function(){		
			if(this.model.get('editting')==true)
				this.area.visible=true;
			else
				this.area.visible=false;
		},this);
		
		this.building.addEventListener('click',function(){
			if(this.model.get('editting')==true)
				this.model.set('editting',false);
			else
				this.model.set('editting',true);
		}.bind(this));
		

		//tick
		this.onTick=this.tick.bind(this);
    createjs.Ticker.addEventListener('tick',this.onTick);

	},
	_drawBuilding:function(){
		//畫出建物
		console.dir("[TowerView]_drawBuilding");
		var building=new createjs.Container();

		var shape=new createjs.Shape();
		shape.graphics
			.beginFill("#33ff33")
			.drawPolyStar(0,0,12,6,0.3,0);
		building.addChild(shape);

		shape=new createjs.Shape();
		shape.graphics
			.beginFill("#3333ff")
			.drawPolyStar(0,0,18,3,0.75,0);
		building.addChild(shape);
	
		return building;
	},
	_drawArea:function(){
		//畫出攻擊範圍
		console.dir("[TowerView]_drawArea, radius:"+this.model.get('radius'));
		var area=new createjs.Shape();
		area.graphics
		.beginFill(createjs.Graphics.getRGB(0x99ff99, 0.5))
		.drawCircle(0,0,this.model.get('radius'));
		return area;
	},
	tick:function(){
		switch(this.model.get('status')){
			case TowerStatus.RELOAD:
				//pass
				this.onReload();
			break;	
			case TowerStatus.READY:
				this.onReady();
			break;
			case TowerStatus.FIRE:
				this.onFire();
			break;
			default:
			break;
		}
	},
	onReload:function(){
		
	},
	onReady:function(){
		var targets=this.search();
		if(targets){
			this.fire(targets);
		}
	},
	onFire:function(){
		
	},
	search:function(){
		//console.log("[TowerView]search");
		var self=this;

		var game=Game.getInstance();
		var monsterCollection=game.get('monsterCollection');
		var target=monsterCollection.find(function(monster){
			//console.dir(monster);
			var monsterView=monster.view;
			var p=monsterView.container.localToLocal(0,0,self.area);
			if(self.area.hitTest(p.x,p.y)){
				return monster;
			}
		});
		if(target){
			self.fire([target]);
		}
	},
	fire:function(targets){
		console.log("[TowerView]fire");
		this.model.set('status',TowerStatus.FIRE);
		
		var targetMonster=_.first(targets);
		var game=Game.getInstance();
		var attackCollection=game.get('attackCollection');
		
		var attack=new Attack({
			currentTower:this.model,
			target:targetMonster
		});
		attackCollection.add(attack);
		
		if(this.timer)
			clearTimeout(this.timer);
		this.timer=setTimeout(this.reload.bind(this),this.model.get('fireTime'));
	},
	reload:function(){
		this.model.set('status',TowerStatus.RELOAD);
		if(this.timer)
			clearTimeout(this.timer);
		this.timer=setTimeout(this.reloadComplete.bind(this),this.model.get('reloadTime'));
	},
	reloadComplete:function(){
		console.log('[TowerView]reloadComplete');
		this.model.set('status',TowerStatus.READY);
		if(this.timer)
			clearTimeout(this.timer);

	}
});
var TowerCollection=Backbone.Collection.extend({
	model:Tower,
	initialize:function(models,options){
		this.attr=new Backbone.Model(options);
	}
});
//==============================================================================
var Attack=Backbone.Model.extend({
	defaults:{
		currentTower:null,//開火塔
		target:null//目標
	}
});
var AttackView=Backbone.View.extend({
	initialize:function(){
		console.log("[AttackView]initialize");
		this.model.view=this;
		
		this.container=new createjs.Container;
		//攻擊實體
		this.missle=this._drawMissle();
		this.container.addChild(this.missle);
		//效果範圍
		this.area=this._drawArea();
		this.container.addChild(this.area);
				
		this.container.x=this.model.get('currentTower').view.container.x;
		this.container.y=this.model.get('currentTower').view.container.y;
		//doshut
		this.doShut();
	},
	_drawMissle:function(){
		var missle=new createjs.Shape();
		missle.graphics
			.beginFill("#000000")
			.drawCircle(0,0,1);
		return missle;
	},
	_drawArea:function(){
		var area=new createjs.Shape();
		area.graphics
			.beginFill(createjs.Graphics.getRGB(0xFF00FF, 0.2))
			.drawCircle(0,0,5);
		return area;		
	},
	doShut:function(){
		var monster=this.model.get('target');
		var target=monster.view.container;

		createjs.Tween.get(this.container)
         .to({x:target.x,y:target.y, visible:false}, 100)
         .call(this.doShutComplete.bind(this));
    
		/*
		this.onTick=function(){
			this.tick();
		}.bind(this);
    createjs.Ticker.addEventListener('tick',this.onTick);
    */
	},
	doShutComplete:function(){
		var monster=this.model.get('target');
		var monsterView=monster.view;
		/*
		this.container.x+=(monsterView.container.x-this.container.x)*0.1;
		this.container.y+=(monsterView.container.y-this.container.y)*0.1;
		*/
		var p=monsterView.container.localToLocal(0,0,this.area);
		if(this.container.hitTest(p.x,p.y)){

			/*
			Game.getInstance().trigger(GameEvent.ATTACK_ON_TARGET,attack);
			*/
			//kill self
			this.model.destroy();
			this.container.parent.removeChild(this);
		}else{
			//fail
		}
	}
});
var AttackCollection=Backbone.Collection.extend({
	model:Attack,
	initialize:function(models,options){
		this.attr=new Backbone.Model(options);
	}
});

