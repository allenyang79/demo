define(['createjs'],function () {
	/*
  return {
  };
  */
  
  var MapCell=function(){
	  createjs.Container.apply(this,arguments);
  }  
  MapCell.prototype=new createjs.Container;
  MapCell.prototype.constructor=MapCell;
  
  //目前坐標
  MapCell.x;
  MapCell.y;
  
  //設定下一步的方向
  MapCell.prototype.getNextCell=function(nextCell){
	  
  }
  //取得下一步的方向
  MapCell.prototype.getNextCell=function(){
	  return this.nextCell;
  }

  createjs.MapCell=MapCell;
  return MapCell;
});