var MapCellModel=Backbone.Model.extend({
	defaults:{		
		x:null,
		y:null,
		type:null,
		around:null
	},
	initialize:function(){
		
	},
	getPosition:function(){
		return {x:this.get('x'),y:this.get('y')};
	},
	connectAround:function(){
		console.log("[MapCellModel]connectAround");
		if(!this.collection)
			return false;
		var around=this.get('around');
		if(!around)
			around={};
			
		var x=this.get('x');
		var y=this.get('y');
		
		//up
		around.top=null;
		if(y>0){
			around.top=this.collection.getCell(x,y-1);
		}
		//left
		around.left=null;
		if(x>0){
			around.left=this.collection.getCell(x-1,y);
		}
		//bottom
		around.bottom=null;
		if(y<this.collection.attr.get('totalRow')-1){
			around.bottom=this.collection.getCell(x,y+1);
		}		
		//right
		around.right=null;
		if(x<this.collection.attr.get('totalCol')-1){
			around.right=this.collection.getCell(x+1,y);
		}				
		this.set('around',around);
	},
	isEndPosition:function(){
		//console.log('[MapCellModel]isEndPosition');
	 	var game=Game.getInstance();
	 	var endList=game.get('endPosition');
		var p=this.getPosition();
		var index=_.find(endList,function(ep){
			return _.isEqual(p,ep);
		});
		if(index){
			return true;
		}
		return false;
	},
	broadcastDistance:function(){
		console.log('[MapCellModel]broadcastDistance');
		var self=this;
		if(this.isEndPosition()){
			this.set('distance',0);
			this.unset('nextMapCells');//沒有下一步
		}
		//braodCast around 
		_.each(this.get('around'),function(element, index, list){
			if(element)
				element.onBroadcastDistance(self,self.get('distance'));
		});
	},
	onBroadcastDistance:function(fromCellModel,distance){
		//console.log("[MapCellModel]onBroadcastDistance");
		var self=this;
		if(this.isEndPosition())
			return true;
		
		var nextMapCells=this.get('nextMapCells');
		if(!nextMapCells)
			nextMapCells=[];
		var needReBroadcast=false;
		if(this.get('distance')===undefined){
			this.set('distance',distance+1);
			nextMapCells.push(fromCellModel);
			needReBroadcast=true;
		}else{
			if(this.get('distance')>distance+1){
				this.set('distance',distance+1);
				nextMapCells=[fromCellModel];
				needReBroadcast=true;
			}else if(this.get('distance')==distance+1){
				nextMapCells.push(fromCellModel);
				needReBroadcast=false
			}else{
				needReBroadcast=false;
			}
			//pass 
		}
		
		this.set('nextMapCells',nextMapCells);
		//如果不是道路，就不用廣播了
		if(this.get('type')!==0)
			return;
		if(needReBroadcast){
			_.each(this.get('around'),function(element, index, list){
				if(element!=undefined && fromCellModel!=element){
					//console.log(index);
					element.onBroadcastDistance(self,self.get('distance'));
				}
			});
		}
	}
});
var MapCellView=Backbone.View.extend({
	initialize:function(){
		this.model.view=this;
		this.preRender();
		
		this.container.addEventListener('click',function(){
			//console.log(this.model.get('around'));
			console.log(_.str.sprintf('%s,%s is end?',this.model.get('x'),this.model.get('y'),this.model.isEndPosition()));
			console.log("around:");
			console.dir(this.model.get('around'));
			console.log('distance:');
			console.log(this.model.get('distance'));
			
			if(this.model.get('type')==0){
				var game=Game.getInstance();
				game.addMonsterByCell(this.model);
			}else if(this.model.get('type')==1)
			{
				var game=Game.getInstance();
				game.addTowerByCell(this.model);				
			}
			//trigger Game to add monster
			//gaem.addMonsterByCell(cell);
			//gaem.addMonsterPosition(cell);
			
		}.bind(this));
	},
	preRender:function(){
		if(!this.container)
			this.container=new createjs.Container;
		var game=Game.getInstance();
		var cellWidth=game.get('cellWidth');
		var cellHeight=game.get('cellHeight');
		this.container.x=cellWidth*0.5+cellWidth*this.model.get('x');
		this.container.y=cellHeight*0.5+cellHeight*this.model.get('y');		
		
		var color=this.model.get('type')==0?"#efefef":"#cccccc";
		var g = new createjs.Graphics()
			.beginFill(color)
			.drawRect(cellWidth*-0.5,cellHeight*-0.5,cellWidth,cellHeight);
		var sp=new createjs.Shape(g);
		this.container.addChild(sp);
	},
	render:function(){
		
	}
})

var Map= Backbone.Collection.extend({
	model:MapCellModel,
	initialize:function(models,options){
		console.log("[Map]initialize");
		this.attr=new Backbone.Model(options);
	},
	initMap:function(mapData){
		console.log("[Map]initMap");
		
		var cellArray=this.attr.get('cellArray');
		if(!cellArray){
			cellArray=[];
			this.attr.set('cellArray',cellArray);
		}

		for(var i=0;i<mapData.length;i++){
			for(var j=0;j<mapData[i].length;j++){
				//console.log(i+","+j);
				
				if(cellArray[i]==null)
					cellArray[i]=[];

				var cell=new MapCellModel({
					x:i,
					y:j,
					type:mapData[i][j]
				});
				cellArray[i][j]=cell;
				this.add(cell);
			}
		}
		
		this.attr.set('cellArray',cellArray);
		this.attr.set('totalCol',cellArray.length);
		this.attr.set('totalRow',cellArray[0].length);

		this.connectPath();
	},
	setCell:function(i,j,cell){
		this.attr.get('cellArray')[i][j]=cell;
		this.add(cell);
	},
	getCell:function(i,j,cell){
		return this.attr.get('cellArray')[i][j];
	},
	connectPath:function(){
		console.log("[Map]connectPath");
//	console.log(this.attr.get('totalCol')+","+this.attr.get('totalRow'));
		for(var i=0;i<this.attr.get('totalCol');i++){
			for(var j=0;j<this.attr.get('totalRow');j++){
//				console.log("G");
				var cell=this.getCell(i,j);
				cell.connectAround();
			}
		}
		
	},
	optimizePath:function(){
		console.log("[Map]optimizePath");
		var self=this;
		//get END POSITION //and build best path
		var game=Game.getInstance();
		var endList=game.get('endPosition');
		this.each(function(cell){
			cell.unset('distance');
		});
		_.each(endList,function(element, index, list){
			var cell=self.getCell(element.x,element.y);
			cell.broadcastDistance();
		});

	},
});

MapView=Backbone.View.extend({
	initialize:function(){
		this.preRender();
	},
	preRender:function(){
		var self=this;
		if(!this.container)
			this.container=new createjs.Container;

		this.model.each(function(cellModel){
			var cellView=new MapCellView({model:cellModel});
			self.container.addChild(cellView.container)
		})
	
		//console.log("[MapView]prerender");
		//console.dir(this.model);
	}
});

