/*global define */
define(['createjs','toxi'], function () {
	console.log("Arrow.js load");
	var SeekArrow=function(){
		createjs.Container.apply(this);

		this.arrowBody=new createjs.Shape();
    this.arrowBody.graphics
	    .beginFill(createjs.Graphics.getRGB(0xff0000,0.7))
	    .moveTo(0,0)
	    .lineTo(-20,15)
	    .lineTo(-5,0)
	    .lineTo(-20,-15)
	    .lineTo(0,0);
	    
		this.velSp=new createjs.Shape();   
    this.targetVel=new toxi.geom.Vec2D(200,200);
    this.desireVel=new toxi.geom.Vec2D(0,0);
    this.steerVel=new toxi.geom.Vec2D(0,0);
    this.currVel=new toxi.geom.Vec2D(0,0);
    this.nextVel=new toxi.geom.Vec2D(0,0);
    
    this.addChild(this.velSp);
    this.addChild(this.arrowBody);
	}
	SeekArrow.prototype=new createjs.Container();
	//==描準作標================================================================================================
  SeekArrow.prototype.aim=function(x,y){
    this.targetVel.x=x;
    this.targetVel.y=y;
  }
    
  //tick
  SeekArrow.prototype.tick=function(){
		if(!this.getStage())
			return;
			var stageWidth=this.getStage().canvas.clientWidth;
			var stageHeight=this.getStage().canvas.clientHeight;
	
    if(this.x>stageWidth)
    	this.x=0;
    else if(this.x<0)
    	this.x=stageWidth;      
    	
    if(this.y>stageHeight)
    	this.y=0;
    else if(this.y<0)
    	this.y=stageHeight;      
      	
      	
    //new toxi.geom.Ve2D(0.5,0.5),
    //desireVel　目標力
    this.desireVel.x=this.targetVel.x-this.x;
    this.desireVel.y=this.targetVel.y-this.y;
    this.desireVel=this.desireVel
        .getLimited(50);
      
    //steerVel 修正力=目標力-目前力
    this.steerVel=this.desireVel
      .sub(this.currVel)
      .getLimited(50);
      
		//作用力=目前力+部分的操作力
    this.nextVel=this.currVel
    .add(this.steerVel.scale(0.01))
    .getLimited(50);
     
    this.drawValLine(); 
    
    
    this.currVel=this.nextVel;
    var p=this.currVel.copy();
    
    var degree=p.toPolar().y*180/Math.PI;
    this.x+=this.currVel.x*0.1;
    this.y+=this.currVel.y*0.1;
    this.arrowBody.rotation=degree;
	}
	//繪製力圖
	SeekArrow.prototype.drawValLine=function(){
		 //drawing
    this.velSp.graphics.clear();
    this.velSp.graphics
	    .setStrokeStyle(4,'rect')
	    .beginStroke(createjs.Graphics.getRGB(0x000000,0.5))
	    .moveTo(0,0)
	    .lineTo(this.desireVel.x,this.desireVel.y)
	    .endStroke()
	    //===================
	    .setStrokeStyle(3,'rect')
	    .beginStroke(createjs.Graphics.getRGB(0x0000ff,0.5))
	    .moveTo(0,0)
	    .lineTo(this.steerVel.x,this.steerVel.y)
	    .endStroke()
	    //===================
	    .setStrokeStyle(2,'rect')
	    .beginStroke(createjs.Graphics.getRGB(0xff0000,1))
	    .moveTo(0,0)
	    .lineTo(this.nextVel.x,this.nextVel.y)
	    .endStroke()
	    //===================
	    .setStrokeStyle(1,'rect')
	    .beginStroke(createjs.Graphics.getRGB(0x00ff00,0.35))
	    .moveTo(0,0)
	    .lineTo(this.currVel.x,this.nextVel.y)
	    .endStroke()    
	}

	
	return SeekArrow;
});
