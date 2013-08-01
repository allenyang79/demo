console.log("load map.js");
define(["app","game","cell"],function(App,Game,Cell){
	//Map View Controller
	var MapCollection=Backbone.Collection.extend({
		model:Cell,
		mapArr:[],
		initMap:function(mapData){
			//createMap
			for(var i=0;i<mapData.length;i++){
				for(var j=0;j<mapData[i].length;j++){					
					//var cellOptions=data[i][j];
					var cellModel=Cell.createCellModel({
						x:i,
						y:j,
						type:mapData[i][j]
					});
					
					
					this.setCellModel(i,j,cellModel);
					cellModel.view=Cell.createCellView(cellModel);
					this.view.addChild(cellModel.view);
				}
			}
			//connectMap
			for(var i=0;i<mapData.length;i++){
				for(var j=0;j<mapData[i].length;j++){
					var cell=this.getCellModel(i,j);
					cell.lookAround();
				}
			}
		},
		getCellModel:function(x,y){
			if(this.mapArr[x][y])
				return this.mapArr[x][y];
			else
				return null;
		},
		setCellModel:function(x,y,cell){
			if(!this.mapArr[x])
				this.mapArr[x]=[];
			this.mapArr[x][y]=cell;
			this.add(cell);
			//補上MapData分析器
		},
		
		optimizePath:function(){
			
		}
	});
	//end Map


	return (function(){
		return{
			createMap:function(){
				console.log("create Map Controller , model ,view");
				
				var model=new MapCollection;
				//var model=new GameModel;
				var view=new createjs.Container;				
				
				//bind each 
				model.view=view;
				view.model=model;
				
			
				return {
					model:model,
					view:view,
				};
			}
		}
	}());
});	