define(['createjs','underscore','cell','global','monster'],function (arg1,arg2,Cell) {
	var Map=function(mapData){
		createjs.Container.apply(this,arguments);
		this.mapData=mapData;
		this.totalCol=mapData.length;
		this.totalRow=mapData[0].length;

		//build cell		
		for(var i=0;i<this.totalCol;i++){
			for(var j=0;j<this.totalRow;j++){
				
				var cell=this.createCell({
					x:i,
					y:j,
					type:this.mapData[i][j]
				})
				this.mapData[i][j]=cell;
				this.addChild(cell);
				
				cell.x=GLOBAL.CELL_WIDTH*0.5+GLOBAL.CELL_WIDTH*i;
				cell.y=GLOBAL.CELL_HEIGHT*0.5+GLOBAL.CELL_HEIGHT*j;
			}
		}		
		//連結所有的格子
		for(var i=0;i<this.totalCol;i++){
			for(var j=0;j<this.totalRow;j++){
				cell=this.mapData[i][j];
				cell.connectAround();
			}
		}
		this.optimizePath();
	};
	Map.prototype=createjs.Container.prototype;
	Map.prototype.createCell=function(params){
		var cell=new Cell(params);
		cell.set('map',this);
		return cell;
	}
	Map.prototype.getCell=function(i,j){
		return this.mapData[i][j];
	}
	Map.prototype.optimizePath=function(){
		//var t=(new Date()).getTime();
		for(var i=0;i<this.totalCol;i++){
			for(var j=0;j<this.totalRow;j++){
				cell=this.mapData[i][j];
				cell.del('distance');
			}
		}
		//console.dir(this.mapData[16][6]);
		//console.dir(GLOBAL.END_LOC);
		var endCell=this.mapData[GLOBAL.END_LOC.x][GLOBAL.END_LOC.y];
		endCell.broadcastDistance();
		//console.log(((new Date()).getTime()-t)/1000);
	}
	
	return Map;
});