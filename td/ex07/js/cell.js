console.log("load cell.js");
define(["app","game","map"],function(){
	//var Cell=require("cell");
	
	var CellModel=Backbone.Model.extend({
		default:{
			map:null,//MapCollection
			x:null,
			y:null,
			isRoad:true,
			enableBuild:true,
			around:null,//around cell,
			building:null,// normal is tower,
			view:null,//MapView
			nextCell:[]//next Cell default is array,
		},
		eanblePass:function(){//可以行走
			return this.get('isRoad');
		},
		lookAround:function(){
			console.log("[Cell]"+this.get('x')+","+this.get('y')+" lookAround");
			//觀查四方的Cell

			if(!this.collection){
				return null;
			}
			/*
			var around=this.get('around');
			
			var x=this.get('x');
			var y=this.get('y');
			//up
			around.up=null;
			if(y>0 && this.collection.getCell(x,y-1).get('isRoad')){
				around.up=this.collection.getCell(x,y).get('isRoad');
			}
			//left
			around.left=null;
			if(x>0 && this.collection.getCell(x-1,y).get('isRoad')){
				around.left=this.collection.getCell(x,y).get('isRoad');
			}
			//bottom
			around.bottom=null;
			if(y<this.collection.getRowTotal()-1 && this.collection.getCell(x,y+1).get('isRoad')){
				around.bottom=this.collection.getCell(x,y+1).get('isRoad');
			}		
			//right
			if(x<this.collection.getColTotal()-1 && this.collection.getCell(x+1,y).get('isRoad')){
				around.irght=this.collection.getCell(x+1,y).get('isRoad');
			}				
			this.set('around',around);
			*/
			return true;
		},nextCell:function(){
			//return next step call
		}
	});
	//end Cell
	
	return {
		createCellModel:function(options){
			console.log("[Cell]createCell");
			var m=new CellModel(options);
			return m;
		},
		createCellView:function(model){
			var view=new createjs.Container;
			view.model=model;

			if(view.model.get('type')==0){
				var color="#efefef";
			}
			else{	
				var color="#999999";
			}
				
			var g = new createjs.Graphics()
			.beginFill(color)
			.drawRect(30*-0.5,30*-0.5,30,30);
			//drawCircle(0,0,30);
			view.bg=new createjs.Shape(g);
			view.addChild(view.bg);
			
			view.x=30*0.5+view.model.get('x')*30;
			view.y=30*0.5+view.model.get('x')*30;
			return view;
		}
	};
});