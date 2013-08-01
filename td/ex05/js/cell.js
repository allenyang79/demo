define(['createjs','underscore','global','monster','tower'],function () {
	var Cell=function(params){
		createjs.Container.apply(this,arguments);
		this.attrs={};
		_.extend(this.attrs,params);
		//console.dir(this.attrs);
		//console.log(this.get('type'));

		//init background
		//console.log(this.get('x')+","+this.get('y')+","+this.get('type')+","+this.attrs.type);
		if(this.get('type')==0){
			var color="#efefef";
		}
		else{	
			var color="#999999";
		}
			
		var g = new createjs.Graphics()
		.beginFill(color)
		.drawRect(GLOBAL.CELL_WIDTH*-0.5,GLOBAL.CELL_HEIGHT*-0.5,GLOBAL.CELL_WIDTH,GLOBAL.CELL_HEIGHT);
		//drawCircle(0,0,30);
		this.bg=new createjs.Shape(g);
		this.addChild(this.bg);
		
		//
		this.addEventListener('click',function(){
			//console.dir(this);
			//this.broadcastDistance();
			console.log(this.get("x")+","+this.get("y")+" distance:"+this.get('distance'));
		}.bind(this));
		
		this.addEventListener('dblclick',function(){
			console.log("DB CLICK");
			//test
			/*
			GLOBAL.END_LOC=this.getLoc();
			this.get('map').optimizePath();
			*/
			//create monster
			if(this.get('type')==0){	
				console.log(this.get('type'));
	
				var stage=this.getStage();
				var m=new createjs.Monster({
					currCell:this
				});
				stage.addChild(m);
				m.startRun();
			}else if(this.get('type')==1){

				var stage=this.getStage();
				var tower=new createjs.Tower({
					currCell:this
				});
				stage.addChild(tower);
			}
			

			
		}.bind(this))

	};
	//Cell.prototype=createjs.Container.prototype;
		Cell.prototype=_.extend(Cell.prototype,createjs.Container.prototype);
	/*
		@add method or property
		Cell.prototype.foo=function(){....}
	*/
	//Cell.prototype.map=null;
	Cell.prototype.get=function(key){
		if(this.attrs[key]!==null)
			return this.attrs[key];
		else{
			return undefined;
		}
	}
	Cell.prototype.set=function(key,value){
		this.attrs[key]=value;
		this.dispatchEvent('change:'+key,this);
	}
	Cell.prototype.del=function(key){
		delete this.attrs[key];
	}
	Cell.prototype.connectAround=function(){

		var around={};
		//left
		around.left=null;
		if(this.get('x')>0){
			if(this.get('map').mapData[this.get('x')-1][this.get('y')].get('type')==0)
				around.left=this.get('map').mapData[this.get('x')-1][this.get('y')];
		}
		//top
		around.top=null;
		if(this.get('y')>0){
			if(this.get('map').mapData[this.get('x')][this.get('y')-1].get('type')==0)
				around.top=this.get('map').mapData[this.get('x')][this.get('y')-1];
		}
		//right
		around.right=null;
		if(this.get('x')<this.get('map').mapData.length-1){
			if(this.get('map').mapData[this.get('x')+1][this.get('y')].get('type')==0)
				around.right=this.get('map').mapData[this.get('x')+1][this.get('y')];
		}
		//bottom
		around.bottom=null;
		if(this.get('y')<this.get('map').mapData[this.get('x')].length-1){
			if(this.get('map').mapData[this.get('x')][this.get('y')+1].get('type')==0)
				around.bottom=this.get('map').mapData[this.get('x')][this.get('y')+1];
		}
		this.set('around',around);
	}
	//取得坐標
	Cell.prototype.getLoc=function(){
		return {x:this.get('x'),y:this.get('y')};
	}
	
	Cell.prototype.broadcastDistance=function(distance){
		//如果我是終點，告訴附近的我是終點
		//console.log("[Cell]"+this.get('x')+","+this.get("y")+"broadcastDistance");
		var self=this;
		if(_.isEqual(self.getLoc(),GLOBAL.END_LOC)){
			self.set('isEndCell',true);
			self.set('distance',0);
			//console.dir(this.get('around'));
			_.each(this.get('around'),function(element,index,list){
				if(element)
					element.onBroadcastDistance(self,this.get('distance'));
			}.bind(self));
		}else{
			_.each(this.get('around'),function(element,index,list){
				//console.log("index:"+index);
				if(element)
				{
					element.onBroadcastDistance(self,this.get('distance'))
				}
			}.bind(self));
		}
	}
	Cell.prototype.onBroadcastDistance=function(targetCell,distance){
		//console.log("[Cell]"+this.get('x')+","+this.get("y")+"onBroadcastDistance");
		//console.log("distance:"+this.get('distance'));
		if(_.isEqual(this.getLoc(),GLOBAL.END_LOC)){
			return;
		}
		if(this.get('distance')===undefined){
			//console.log("A");
			this.set('nextCell',targetCell);
			this.set('distance',distance+1);
			this.broadcastDistance(this,this.get('distance'));

		}else if(this.get('distance')>distance+1){
			//console.log("B");
			this.set('nextCell',targetCell);
			this.set('distance',distance+1);			
			this.broadcastDistance(this,this.get('distance'));

		}else{
			//pass
			//console.log("C");
		}
	}
	return Cell;
});