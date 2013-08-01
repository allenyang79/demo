var MonsterStatus={
	DIE:0,
	THINK:1,
	RUSH:2,//衝刺
	PASS:3//通過
};
var Monster=Backbone.Model.extend({
	defaults:{
		currentMapCell:null,
		status:MonsterStatus.THINK,//0:die,1:think,2:walk
		effect:0,//0:no,1:onAttacl,2:onFreeze
		speed:2,
		life:100,//血
	},
	initialize:function(){
		console.log("[Monster]initialize");
		console.dir(this.attributes);
	},
});
var MonsterView=Backbone.View.extend({
	initialize:function(){
		console.log("[Monster]initialize");
		this.model.view=this;
		var game=Game.getInstance();		
		//bind model and view
		this.container=new createjs.Container;
		
		this.shape=new createjs.Shape();
		
		this.model.set('color','#ff0000');
		this.shape.graphics.clear();
		this.shape.graphics
			.beginFill(this.model.get('color'))
			.drawPolyStar(0,0,15,3,0.6,0);
		this.container.addChild(this.shape);
			
		this.model.on('change:status',this.onChangeStatus,this);
		
		this.model.on('add',function(){
			console.log("[MonsterView]onAdd");
		},this);

		//set Position
		console.dir('[MonsterView]currentCell');
		console.dir(this.model.get('currentCell'));
		this.container.x=this.model.get('currentCell').view.container.x
		this.container.y=this.model.get('currentCell').view.container.y;
		//console.log("[MonsterView]currentCell");
		//console.dir(this.model.get('currentCell'));
		this.think();
	},
	onChangeStatus:function(){
		console.log("[MonsterView]onChangeStatus");
		console.log("now status",this.model.get('status'));
		var status=this.model.get('status');
		switch(status){
			case MonsterStatus.THINK:
				this.model.set('status',MonsterStatus.RUSH);
				break;
				
			case MonsterStatus.RUSH:
				this.rush();
				break;
		}
	},
	think:function(){
		console.log("[MonsterView]think");
		console.dir(this.model);
		if(this.model.get('status')==MonsterStatus.THINK){
			this.model.set('status',MonsterStatus.RUSH);
		}
	},
	rush:function(){
		console.log("[Monster]rush");
		var nextMapCells=this.model.get('currentCell').get('nextMapCells');
		
		var nextCell=nextMapCells[_.random(0,nextMapCells.length-1)];
		//位移
		var toX=nextCell.view.container.x;
		var toY=nextCell.view.container.y;
		//角度
		this.container.rotation=Math.atan2(toY-this.container.y,toX-this.container.x) * 180 / Math.PI;
		
    var tween=createjs.Tween.get(this.container).to({x:toX,y:toY}, this.model.get('speed')*1000,createjs.Ease.linear).call(function(){
    
    	if(nextCell.isEndPosition()){
    		alert(GameEvent.MONSTER_TOUCH_DOWN);
	    	Game.getInstance().trigger(GameEvent.MONSTER_TOUCH_DOWN,this);
    	}else{
	    	this.model.set('currentCell',nextCell);
				this.model.set('status',MonsterStatus.THINK);
			}
    }.bind(this));
	},
	die:function(){
		
	}
});
var MonsterCollection=Backbone.Collection.extend({
	model:Monster,
	initialize:function(models,options){
		this.attr=new Backbone.Model(options);
	}
});