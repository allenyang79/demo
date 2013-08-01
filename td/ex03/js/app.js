define(['createjs','ui','backbone','cell'],function () {
	var config={
		cellWidth:30,
		cellHeight:30,
		startLoc:{
			x:0,
			y:0
		},
		endLoc:{
			x:17,
			y:7
		}
	};
	var mapData=[
				[0,1,0,0,0, 1,0,0,0,0, 0,0,0,0,0, 0,1,1],
				[0,1,0,1,0, 1,0,1,1,1, 1,1,0,1,1, 0,0,0],
				[0,1,0,1,0, 1,0,0,0,0, 1,1,0,0,1, 1,1,0],
				[0,0,0,1,0, 1,0,1,1,1, 1,1,1,1,1, 0,0,0],
				[1,1,0,1,0, 1,0,0,0,0, 0,1,0,0,0, 0,1,1],
				[1,1,0,1,0, 1,1,1,1,1, 0,1,0,1,1, 1,1,1],
				[1,1,0,1,0, 0,0,0,0,1, 0,1,0,1,1, 1,1,1],
				[0,0,0,1,1, 1,1,1,0,0, 0,1,0,0,0, 0,0,0]
			];					  					 					  	 

	var stage=new createjs.Stage("canvas");
	//初始化地圖
	mapData=initMap(mapData);
	//連結所有的地圖
	//connectAllCell();
	//最佳化路徑

	createjs.Ticker.addEventListener("tick",tick);
	function tick(){
		stage.update();
	}

	function initMap(mapData){
		//翻轉９０
		mapData=rotateMapData(mapData);
		for(var i=0;i<mapData.length;i++){
			var str="";
			for(var j=0;j<mapData[0].length;j++){
				console.log(i+","+j);
				/*
				var cell=createCell(i,j,mapData[i][j]);
				mapData[i][j]=cell;
				stage.addChild(cell);
				*/
			}
		}
		return mapData;
	}
	/*
	function connectAllCell(){
		for(var i=0;i<mapData.length;i++){
			var str="";
			for(var j=0;j<mapData[0].length;j++){
				var cell=mapData[i][j];
				cell.connectAround();
			}
		}
	}
	
	
	

	function rotateMapData(mapData){
		var mapArr=[];
		for(var i=0;i<mapData[0].length;i++){
			for(var j=0;j<mapData.length;j++){
				if(mapArr[i]==null)
					mapArr[i]=[];
				mapArr[i][j]=mapData[j][i];
			}
		}
		return mapArr;
	}
	
	function createCell(x,y,type){
		
	}
	//========================================
	*/

});
